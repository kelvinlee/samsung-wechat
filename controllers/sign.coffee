# 基本类库
fs = require 'fs'
path = require 'path'
crypto = require 'crypto'

# 扩展类库
EventProxy = require 'eventproxy'
config = require('../config').config
https = require 'https'
url = require 'url'
plugs = require './wechat-plugs'
helper = require "../lib/helper"


User = require('../model/mongo').User
Inte = require('../model/mongo').Inte
Lots = require('../model/mongo').Lots
Warehouse = require('../model/mongo').Warehouse
Topic = require('../model/mongo').Topic
Comment = require('../model/mongo').Comment
# 需要授权
Authorize_Url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=#{config.APPID}&redirect_uri={url}&response_type=code&scope=snsapi_userinfo&state={state}#wechat_redirect"

Noconcern = "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200560267&idx=1&sn=ff18fdd9bbf0efe2dde9ccc8d3028fb4#rd"



# 授权逻辑. 菜单授权,判断是否授权过,判断是否注册过.

# 获取授权,如果没有就进行注册
regs = (req,res,next)->
	console.log "regs"
	ep = new EventProxy.create "token","info",(token,info)->
		console.log "返回的用户信息:",token,info
		res.cookie "regs",null
		return res.send {error:"授权失败."} if info? and info.errcode?
		res.locals.openid = token.openid
		User.getUserOpenId token.openid,(err,resutls)->
			if resutls?
				next()
			else
				User.newAndSave token.openid,info.nickname,info.sex,info.province,info.country,info.headimgurl,(err,resutls)->
					next()
		
	if req.cookies.regs? and req.cookies.regs is "now"
		if req.query.code?
			plugs.getUToken req.query.code,(reb)->
				reb.on "data",(chunk)->
					obj = JSON.parse chunk
					ep.emit "token",obj
					plugs.getAuUserInfo obj.access_token,obj.openid,(rebs)->
						rebs.on "data",(chunks)->
							userinfo = JSON.parse chunks
							ep.emit "info",userinfo
		else
			ep.emit "token",null
			ep.emit "info",null
	else
		next()

exports.regs = regs
# 判断是否能够获取到用户授权.
exports.before = (req,res,next)->
	console.log "check user"
	res.locals.menu_my = ""
	res.locals.menu_lucky = ""
	res.locals.menu_exchange = ""
	# console.log "cookie:",req.cookies
	# 测试奖品,默认值
	setsomeDefautleLots()
	# setDefaultTopic()
	# console.log req.cookies.userid
	if req.cookies.userid? and req.cookies.userid isnt "undefined" and req.cookies.userid isnt ""
		# req.cookies.userid = req.cookies.userid
		next()
	else
		res.redirect Noconcern

exports.middle = (req,res,next)->
	openid = req.params.openid
	url = req.query.url

	# return res.send {openid:openid,url:url,cookie:req.cookies.userid}

	console.log "openid:",openid
	User.getUserOpenId openid,(err,user)->
		if user?
			res.cookie "userid",user._id
			res.cookie "openid",openid
			# res.send {"has":true,user:user}
			console.log {"has":true,user:user,cookie:req.cookies.userid}
			res.redirect url
		else
			User.regbyOpenId openid,(err,user)->
				res.cookie "userid",user._id
				res.cookie "openid",openid
				Inte.newInte user._id,100,"初次注册赠送积分活动,100积分",(err,inte)->
					# console.log "初次注册赠送积分活动,1000积分"
					console.log {"has":false,user:user,cookie:req.cookies.userid}
					res.redirect url


exports.up = (req,res,next)->
	res.render "reg"
exports.up_post = (req,res,next)->
	re = new helper.recode()
	mobile = req.body.mobile
	password = req.body.password
	passwordc= req.body.passwordc

	check = /^[1][3-8]\d{9}$/
	if not check.test mobile
		re.recode = 201
		re.reason = "请验证手机号码格式"
		return res.send re
	if password isnt passwordc
		re.recode = 201
		re.reason = "两次密码不同,请重新输入."
		return res.send re

	User.findByMobile mobile,(err,user)->
		if user?
			re.recode = 201
			re.reason = "此手机号已经注册过了."
			return res.send re
		else
			User.newAndSave mobile,password,(err,newuser)->
				console.log err,newuser
				res.send re
	
exports.in = (req,res,next)->
	res.render "login"
exports.in_post = (req,res,next)->
	re = new helper.recode()
	mobile = req.body.mobile
	password = req.body.password
	check = /^[1][3-8]\d{9}$/
	if not check.test mobile
		re.recode = 201
		re.reason = "请验证手机号码格式"
		return res.send re

	User.login mobile,password,(err,user)->
		if user?
			user.update_at = new Date()
			user.save()
			res.cookie "userid",user._id
			res.send re
		else
			re.recode = 201
			re.reason = "手机号码或密码错误."
			res.send re

tointe = (req,res,next)->
	re = new helper.recode()
	if not req.cookies.userid?
		re.recode = 201
		re.reason = "请先登录."
		res.send re
		return ""
	Inte.today req.cookies.userid,(err,today)->
		console.log "签到:"+today
		if today?
			re.recode = 201
			re.reason = "今天已经签到过了."
			res.send re
		else
			Inte.newInte req.cookies.userid,20,"regs",(err,resutls)->
				console.log "签到成功:",resutls
				res.send re
exports.tointe = tointe

exports.my = (req,res,next)->
	res.locals.menu_my = "active"
	# res.render "my"
	console.log "userid:",req.cookies.userid
	ep = new EventProxy.create "user","inte","today",(user,inte,today)->
		count = inte
		
		res.render "my",{user:user,inte:count,today:today}

	Inte.today req.cookies.userid,(err,resutls)->
		ep.emit "today",resutls
	User.getUserById req.cookies.userid,(err,resutls)->
		ep.emit "user",resutls
	Inte.getInteAll req.cookies.userid,(err,resutls)->
		ep.emit "inte",resutls

exports.exchange = (req,res,next)->
	res.locals.menu_exchange = "active"
	res.render "exchange"
exports.exchange_type = (req,res,next)->
	res.locals.menu_exchange = "active"
	console.log req.params.type_id

	Lots.getLots (err,list)->
		res.render "exchange-type",{list:list}
exports.exchangelot = (req,res,next)->
	res.locals.menu_exchange = "active"
	id = req.params.lots_id
	re = new helper.recode()

	console.log req.query
	console.log req.params

	ep = new EventProxy.create "inte","lots",(inte,lots)->
		console.log lots,inte
		
		Warehouse.getByUserId req.cookies.userid,id,(err,ihas)->
			if ihas?
				re.reason = ihas._id
				res.send re
			else
				# 无需积分 and inte >= lots.inte
				if lots? 
					Warehouse.getOne lots._id,(err,lot)->
						if lot?
							lot.usedby = req.cookies.userid
							lot.used = true
							used_at = new Date()
							lot.save()
							# res.send re
							re.reason = lot._id
							Inte.newInte req.cookies.userid,-lots.inte,"兑换奖品:"+lot._id,(err,int)->

								res.send re
						else
							re.recode = 201
							re.reason = "此奖品已经被兑换光了,请等待补充."
							res.send re

				else
					re.recode = 201
					# re.reason = "积分不足,无法兑换."
					re.reason = "此奖品已经被兑换光了,请等待补充."
					res.send re
		# Warehouse.getOne id,(err,lot)->


	Lots.getById id,(err,lots)->
		ep.emit "lots",lots

	Inte.getInteAll req.cookies.userid,(err,resutls)->
		ep.emit "inte",resutls
# 我的奖品
exports.mylot = (req,res,next)->
	res.locals.menu_exchange = "active"
	id = req.params.lot_id
	Warehouse.getById id,(err,lot)->
		console.log lot
		if lot? and lot.usedby+"" is req.cookies.userid
			Lots.getById lot.info,(err,lotinfo)->
				res.render "elot",{lot:lot,lotinfo:lotinfo}
		else
			# res.render "elot",{lot:null,lotinfo:null}
			res.redirect "/sign/exchange/1"


exports.luckyframe = (req,res,next)->
	res.render "luckyframe"

exports.getlucky = (req,res,next)->
	re = new helper.recode()
	re.url = ""
	Inte.getInteAll req.cookies.userid,(err,resutls)->
		# ep.emit "inte",resutls
		# getlucky
		if resutls >= 50
			Inte.newInte req.cookies.userid,-50,"抽奖",(err,int)->
				list = [[14,14,14],[14,14,12],[14,12,12],[15,15,15],[13,13,13],[12,12,11],[11,11,11]]
				lot = Math.round(Math.random()*10000)
				console.log lot
				# 游戏页面，抽奖概率，奖品单页
				# 存入中奖信息, 然后更新数据库.


				# rewritelot = Math.round(Math.random()*6)
				# switch rewritelot
				# 	when 0
				# 		lot = 8
				# 		break
				# 	when 1
				# 		lot = 9
				# 		break
				# 	when 2
				# 		lot = 12
				# 		break
				# 	when 3
				# 		lot = 200
				# 		break
				# 	when 4
				# 		lot = 501
				# 		break
				# 	when 5
				# 		lot = 2000
				# 		break 
				# 	when 6
				# 		lot = 9000
				# 		break


				# console.log "中奖号码:#{lot}"

				if lot is 8
					console.log "平板"
					# samsung tab s
					return Warehouse.getWinnerByInfo "Tabs",(err,lots)->
						if lots?
							lots.usedby = req.cookies.userid
							lots.used = true
							lots.save()
							re.url = "/sign/winner/"+lots._id
							re.reason = list[0]
							re.reason = re.reason.join(",")
							res.send re
						else
							none = [[13,12,13],[11,13,15],[13,15,11]]
							re.reason = none[Math.ceil(Math.random()*(none.length-1))]
							re.reason = re.reason.join(",")
							res.send re
				if lot >= 1 and lot <=10 and lot != 8
					# 耳机
					console.log "耳机"
					return Warehouse.getWinnerByInfo "Headset",(err,lots)->
						if lost?
							lots.usedby = req.cookies.userid
							lots.used = true
							lots.save()
							re.url = "/sign/winner/"+lots._id
							re.reason = list[1]
							re.reason = re.reason.join(",")
							res.send re
						else
							none = [[13,12,13],[11,13,15],[13,15,11]]
							re.reason = none[Math.ceil(Math.random()*(none.length-1))]
							re.reason = re.reason.join(",")
							res.send re
				if lot >= 11 and lot <=20
					# 移动电源
					console.log "移动电源"
					return Warehouse.getWinnerByInfo "Power",(err,lots)->
						if lots?
							lots.usedby = req.cookies.userid
							lots.used = true
							lots.save()
							re.url = "/sign/winner/"+lots._id
							re.reason = list[2]
							re.reason = re.reason.join(",")
							res.send re
						else
							none = [[13,12,13],[11,13,15],[13,15,11]]
							re.reason = none[Math.ceil(Math.random()*(none.length-1))]
							re.reason = re.reason.join(",")
							res.send re

				if lot >=150 and lot <= 300
					# 搜狐公仔
					console.log "搜狐公仔"
					return Warehouse.getWinnerByInfo "sohugz",(err,lots)->
						if lots?
							lots.usedby = req.cookies.userid
							lots.used = true
							lots.save()
							re.url = "/sign/winner/"+lots._id
							re.reason = list[4]
							re.reason = re.reason.join(",")
							res.send re
						else
							none = [[13,12,13],[11,13,15],[13,15,11]]
							re.reason = none[Math.ceil(Math.random()*(none.length-1))]
							re.reason = re.reason.join(",")
							res.send re

				if lot >=1500 and lot<=3000
					# 300积分
					# console.log "300积分"
					return Inte.getInteAction "抽奖获得,300积分",(err,resutls)->
						if resutls<300
							if req.cookies.userid?
								Inte.newInte req.cookies.userid,300,"抽奖获得,300积分",(err,inte)->
							re.url = "/sign/winner/300"
							re.reason = list[3]
							re.reason = re.reason.join(",")
							res.send re
						else
							none = [[13,12,13],[11,13,15],[13,15,11]]
							re.reason = none[Math.ceil(Math.random()*(none.length-1))]
							re.reason = re.reason.join(",")
							res.send re

				if lot >4000 and lot <= 8000
					# 东坡
					re.url = "/sign/winner/dp"
					re.reason = list[5]
					re.reason = re.reason.join(",")
					return res.send re
				# if lot >=3000 and lot <= 6000
				# 	# 火锅
				# 	re.url = "/sign/winner/hg"
				# 	re.reason = list[6]
				# 	re.reason = re.reason.join(",")
				# 	res.send re

				if re.reason is "success"
					console.log "没有抽中"
					# 15 300积分
					# 14 三星 不能用
					# 13 50元
					# 12 东坡
					# 11 火锅 不能和12同时出现
					none = [[13,12,13],[11,13,15],[13,15,11]]
					re.reason = none[Math.ceil(Math.random()*(none.length-1))]
					re.reason = re.reason.join(",")
					return res.send re
		else
			re.recode = 201
			re.reason = "积分不足"
			res.send re



exports.nickname = (req,res,next)->
	res.render "nickname"
exports.postnickname = (req,res,next)->
	nickname = req.body.nickname
	re = new helper.recode()
	console.log "nickname:",nickname,req.cookies.userid
	if nickname?
		User.findByNickname nickname,(err,user)->
			console.log "nickname:",err,user
			if user?
				re.recode = 201
				re.reason = "昵称已经存在,再试试其他的名称."
				return res.send re
			User.getUserById req.cookies.userid,(err,user)->
				console.log user
				if user?
					user.nickname = nickname
					user.save()
					res.send re
				else
					re.recode = 201
					re.reason = "还没有登录"
					res.send re
	else
		re.recode = 201
		re.reason = "昵称不能为空"
		res.send re


# 论坛
exports.topic = (req,res,next)->
	
	# tid = req.params.topic_id
	console.log "topic:",req.cookies.openid
	if req.cookies.openid?
		User.getUserOpenId req.cookies.openid,(err,user)->
			console.log user
			if user? and user.nickname?
				Topic.getOne (err,topic)->
					console.log "topic:"+topic
					if topic?
						Comment.getByTopic topic._id,(err,comments)->
							# console.log topic,comments
							res.render "topic",{topic:topic,comments:comments}
							topic.view += 1
							topic.save()
					else
						res.render "topic",{topic:null}
			else
				res.redirect "/nickname"
	else
		res.redirect Noconcern
		
# 接受
exports.comment = (req,res,next)->
	content = req.body.comment
	re = new helper.recode()
	if not content? or content is ""
		re.recode = 201
		re.reason = "评论内容不能为空"
		return res.send re
	Topic.getOne (err,topic)->
		if topic?
			User.getUserOpenId req.cookies.openid,(err,user)->
				console.log "话题评论:",err,user,req.cookies.openid
				if user?
					reg = /(\d{3})\d{4}(\d{4})/
					# name = user.mobile.replace reg,"$1****$2"
					name = user.nickname
					Comment.newComment user._id,topic._id,name,content,(err,comment)->
						if comment?
							res.send re
						else
							re.recode = 201
							re.reason = "评论失败,请重试"
							res.send re
				else
					re.recode = 201
					re.reason = "还没登陆,无法评论"
					return res.send re
			
exports.comments = (req,res,next)->
	re = new helper.recode()
	re.comments = []
	startime = req.query.startime
	if startime?
		startime = new Date parseInt startime
	else
		startime = new Date()

	Topic.getOne (err,topic)->
		if topic?
			Comment.getByTopic topic._id,(err,comments)->
				re.comments = comments
				res.send re
		else
			res.send re


exports.lucky = (req,res,next)->

	res.locals.menu_lucky = "active"

	res.render "lucky"

exports.art = (req,res,next)->
	art = "active-"+req.params.art_id
	res.render "art",{art:art}
exports.active = (req,res,next)->
	# art = "active-"+req.params.art_id
	res.render "active-"+req.params.ac_id


exports.page1 = (req,res,next)->
	res.render "page1"

exports.page2 = (req,res,next)->
	res.render "page2"
	
exports.page3 = (req,res,next)->
	res.render "page3"

exports.page4 = (req,res,next)->
	res.render "page4"

exports.page5 = (req,res,next)->
	res.render "page5"

exports.page6 = (req,res,next)->
	res.render "page6"

exports.page7 = (req,res,next)->
	res.render "page7"
	
exports.page8 = (req,res,next)->
	res.render "page8"

# 
exports.game = (req,res,next)->
	res.render "gamedown"
# 中奖填写
exports.lots = (req,res,next)->
	res.render "lots"

exports.winner = (req,res,next)->
	res.locals.menu_lucky = "active"

	id = req.params.winner_id
	if id is "dp"
		return res.render "lots-dp"
	if id is "hg"
		return res.render "lots-hg"
	if id is "300"
		return res.render "lots-300"

	Warehouse.getWinnerById id,(err,win)->
		if win?
			res.render "lots",{win:win}
		# else

exports.winner_post = (req,res,next)->
	re = new helper.recode()

	username = req.body.username
	mobile = req.body.mobile
	adr = req.body.adr

	if not username? or username is ""
		re.recode = 201
		re.reason = "用户名不能为空"
		return res.send re

	check = /^[1][3-8]\d{9}$/
	if not check.test mobile
		re.recode = 201
		re.reason = "请验证手机号码格式"
		return res.send re
	if not adr? or adr is ""
		re.recode = 201
		re.reason = "邮寄地址不能为空"
		return res.send re
	Warehouse.getWinnerByUandW req.cookies.userid,req.params.winner_id,(err,win)->
		if win? and win.username?
			re.recode = 201
			re.reason = "您已经提交过此中奖信息,无法更改."
			return res.send re
		if win?
			win.username = username
			win.mobile = mobile
			win.adr = adr
			win.create_at = new Date()
			win.save()
			res.send re
		else
			re.recode = 201
			re.reason = "请不要使用其他用户的兑奖码"
			res.send re

exports.share = (req,res,next)->
	info = req.params.info
	res.render "share",{info:info}




# 初始化一个话题
setDefaultTopic = ->
	# return false
	list = ["你敢不敢说走就走","你敢不敢说走就走","你敢不敢说走就走","你敢不敢说走就走","你敢不敢说走就走"]

	name = list[Math.ceil(Math.random()*4)]
	description = "你敢不敢说走就走，去那向往的远方，你犹豫着不走，到底是为何？每次旅行都遗憾放弃，到底是什么令你迟迟不走？快来说说牵绊你脚步的那些事儿吧~"
	lot = "迪士尼玩偶"
	startime = new Date()
	endtime  = new Date new Date().getTime()+1000*60*60*2
	Topic.getOne (err,t)->
		if not t?
			Topic.newTopic name,description,lot,startime,endtime,(err,topic)->
				console.log "初始化了一个话题"	

# 初始化奖品
setDefaultWinner = ()->
	for i in [0...5]
		Warehouse.newwinner "Tabs","一等奖","lots-1.jpg",(err,win)->
	for i in [0...10]
		Warehouse.newwinner "Headset","二等奖","lots-2.jpg",(err,win)->
	for i in [0...20]
		Warehouse.newwinner "Power","三等奖","lots-3.jpg",(err,win)->
	for i in [0...50]
		Warehouse.newwinner "sohugz","四等奖","lots-4.jpg",(err,win)->
	


# 设置初始化游戏.
setsomeDefautleLots = ()->
	Lots.getLots (err,list)->
		if list? and list.length > 0
			# console.log "奖品列表,存在"
		else
			console.log "初始化了一些奖品"
			setDefaultWinner()
			
			name = "神偷奶爸：小黄人快跑"
			description = "小黄人快跑！一路搞笑逗趣停不住！"
			img = "/img/game-1.jpg"
			info_a = "版本：2.4.0 大小:47.68MB<br/>  2014年5月31日 <br/>适合所有年龄段人士"
			info_b = "兑换说明：进入游戏主页，点击设置按钮（右上角），输入兑换码<br/>注：此礼包仅可使用于三星专版游戏中"
			info_c = "游戏介绍：<p>在《神偷奶爸》官方游戏中，格鲁忠诚的小黄人已经准备好迎接艰难的挑战啦。扮演小黄人，在搞笑的快节奏挑战中与他人竞争，打败你的老板——超级大反派格鲁！跳跃、飞翔、躲避障碍、收集香蕉、恶作剧，打败其他反派，赢取“年度小黄人”的称号！</p><p>游戏亮点：</p><p>1.重新发现《神偷奶爸》的幸福和幽默。</p><p>2.跑过又去的标志性场所：格鲁的实验室和格鲁的住宅区。</p><p>3.在上百个任务中完成卑鄙动作。</p><p>4.用独一无二的服装、武器和道具自定义你的小黄人。</p><p>5.在多动态摄影视角下游戏。</p><h2>新业务推荐</h2><p>1.加入新地图-市中心</p><p>2.增加套装升级功能</p><p>3.新增3个套装：女仆，高尔夫球手和变装达人</p><p>4.新增任务页面提示</p><p>5.修改菜单名称</p><p>6.更换新icon</p>"
			headerimg = "/img/game-1-title.jpg"
			descriptionimg = "/img/game-1-description.jpg"
			order = 1
			inte = 0
			Lots.newlots name,description,img,order,inte,info_a,info_b,info_c,headerimg,descriptionimg,(err,lots)->
				# if lots?
				# 	Warehouse.newlot lots._id,"game-1-1",(err,lot)->
				# 	Warehouse.newlot lots._id,"game-1-2",(err,lot)->
				# 	Warehouse.newlot lots._id,"game-1-3",(err,lot)->
				# 	Warehouse.newlot lots._id,"game-1-4",(err,lot)->
			name = "武侠Q传"
			description = "拳拳到肉，亲眼见证！体验真实打斗的畅快感受~"
			img = "/img/game-2.jpg"
			info_a = "版本：3.0.0.4.0  大小:107.01MB<br/>2014年7月10日<br/>适合12+年龄段人士"
			info_b = "兑换说明：进入游戏主页，点击设置按钮（右上角），输入兑换码<br/>注：此礼包仅可使用于三星专版游戏中"
			info_c = "<p>《武侠Q传•风云再起》全新资料片火爆开启，逆天内容震撼登场！ 全新3D卡牌！萌系Q版人物，新颖的玩法吸引了无数的武侠小说玩家入住到这个风起云涌变幻莫测的武侠世界中，全新逆天版本“风云再起”全新剧情、新玩法、新弟子、新装备，即将引起另一场江湖的腥风血雨。新资料片特色：【风云再起 多人组队共闯天下会】《武侠Q传•风云再起》全新资料片来袭,“天下会”高手如云，大敌当前兄弟齐上阵，玩家可与其他好友弟子一起共创天下会，好友之间共闯还会获得义气加成噢！【风云再起 全新属性助力战斗】《武侠Q传•风云再起》全新资料加入了种类丰富是全新特殊属性，弟子修炼可获得连击、吸血、斩杀等多样新属性，让游戏的战斗过程更具悬念。想要颠覆战斗、劣势翻盘？各位高玩平时多攒攒自己的人品，保证战斗可以多多触发特殊属性吧。【风云再起 装备阵法全新登场】《武侠Q转•风云再起》当然也会有绝世神兵的出现，神兵利器、古代阵法重现江湖，新装备于阵法将拥有特殊属性，通过合理的搭配与结合，使玩家弟子获得更强劲效果。拥有传说中的神兵利器，神秘的江湖阵法，一统江湖指日可待。【风云再起 全新弟子震撼登场】《武侠Q传•风云再起》中高手如云，隐藏着许多带有传奇色彩的人物，此次在“风云再起”新资料片中更增添了风神、死神、霸主等传奇人物，江湖唾手可得！【风云再起 小伙伴火力全开】新版本“风云再起”把小伙伴的天权位、天玑位、等火力全开，可刷出前所未有的十大属性同时还会激活缘分，享受前所有的效果噢，更强大的小伙伴尽在《武侠Q传•风云再起》。</p>"
			headerimg = "/img/game-2-title.jpg"
			descriptionimg = "/img/game-2-decription.jpg"
			order = 2
			inte = 0
			Lots.newlots name,description,img,order,inte,info_a,info_b,info_c,headerimg,descriptionimg,(err,lots)->
				# if lots?
				# 	Warehouse.newlot lots._id,"game-2-1",(err,lot)->
				# 	Warehouse.newlot lots._id,"game-2-2",(err,lot)->
				# 	Warehouse.newlot lots._id,"game-2-3",(err,lot)->
				# 	Warehouse.newlot lots._id,"game-2-4",(err,lot)->
			# name = "封神英雄榜"
			# description = "群雄聚集，等你加入！体验如梦似幻的英雄之旅~"
			# img = "/img/game-3.jpg"
			# info_a = "版本：1.1.0 大小:92.95MB <br/>2014年7月10日 <br/>适合所有年龄段人士"
			# info_b = "兑换说明：进入游戏主页，点击设置按钮（右上角），输入兑换码<br/>注：此礼包仅可使用于三星专版游戏中"
			# info_c = "<p>在《封神英雄榜》是热播神话古装电视剧正版授权的同名手游，游戏创新地将策略、RPG与卡牌元素完美融合，独特的阵营战以及法宝对战系统，让玩家们感受最新颖的卡牌玩法。《封神英雄榜》采用Q版画风，游戏画面整体俏皮可爱，电视剧角色均以卡通形象在游戏中登场，经典台词在游戏中一一重现，中国风的仙界场景美轮美奂，进行游戏的同时，仿佛置身于仙境之中。传奇的神话战斗，海量神将任你差遣，进入《封神英雄榜》便可体验如梦似幻的游戏乐趣。</p><p>【正版授权 封神故事经典延续】 </p><p>原剧角色Q版形象植入，经典台词一一还原，感受掌中神话大剧<p>【仙家法器海量法宝各显神通】</p><p>神话经典法宝乱入，属性培养，技能强化，海量法宝无穷变化</p><p>【阵营对抗 大型战场公平竞技】 </p><p>首创卡牌阵营战，商周两大势力对抗，首创天枰平衡系统，打响卡牌阵营掠夺战役</p><p>【神魔齐聚 各路大咖同场乱斗】 </p><p>不只有封神，西游记、八仙过海乱入，体验最全神话故事</p><p>【策略卡牌收集养成指挥模拟】</p><p>卡片练功、卡片进化、排兵布阵，瞬息万变左右战局</p>"
			# headerimg = "/img/game-3-title.jpg"
			# descriptionimg = "/img/game-3-decription.jpg"
			# order = 3
			# inte = 0
			# Lots.newlots name,description,img,order,inte,info_a,info_b,info_c,headerimg,descriptionimg,(err,lots)->
				# if lots?
				# 	Warehouse.newlot lots._id,"game-3-1",(err,lot)->
				# 	Warehouse.newlot lots._id,"game-3-2",(err,lot)->
				# 	Warehouse.newlot lots._id,"game-3-3",(err,lot)->
				# 	Warehouse.newlot lots._id,"game-3-4",(err,lot)->
			name = "超级英雄"
			description = "最强英雄，华丽上阵！史上最强英雄穿越来袭~"
			img = "/img/game-4.jpg"
			info_a = "版本：1.1.6  大小:95.51MB<br/>2014年7月10日<br/>适合所有年龄段人士"
			info_b = "兑换说明：进入游戏主页，点击设置按钮（右上角），输入兑换码<br/>注：此礼包仅可使用于三星专版游戏中"
			info_c = "<p><img src='/img/game-4-info.jpg' /></p>"
			headerimg = "/img/game-4-title.jpg"
			descriptionimg = "/img/game-4-decription.jpg"
			order = 4
			inte = 0
			Lots.newlots name,description,img,order,inte,info_a,info_b,info_c,headerimg,descriptionimg,(err,lots)->
				# if lots?
				# 	Warehouse.newlot lots._id,"game-4-1",(err,lot)->
				# 	Warehouse.newlot lots._id,"game-4-2",(err,lot)->
				# 	Warehouse.newlot lots._id,"game-4-3",(err,lot)->
				# 	Warehouse.newlot lots._id,"game-4-4",(err,lot)->




