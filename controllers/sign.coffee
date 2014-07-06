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
	setDefaultTopic()
	# console.log req.cookies.userid
	if req.cookies.userid? and req.cookies.userid isnt "undefined" and req.cookies.userid isnt ""
		res.locals.userid = req.cookies.userid
		next()
	else
		res.redirect "/login"



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
			User.newAndSave mobile,password,(err,user)->
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
	if not res.locals.userid?
		re.recode = 201
		re.reason = "请先登录."
		res.send re
		return ""
	Inte.today res.locals.userid,(err,today)->
		if today? and today.length<=0
			Inte.newInte res.locals.userid,20,"签到",(err,resutls)->
				console.log "签到成功:",resutls
				res.send re
		else
			re.recode = 201
			re.reason = "今天已经签到过了."
			res.send re
exports.tointe = tointe

exports.my = (req,res,next)->
	res.locals.menu_my = "active"
	# res.render "my"
	console.log "userid:",res.locals.userid
	ep = new EventProxy.create "user","inte","today",(user,inte,today)->
		count = inte
		
		res.render "my",{user:user,inte:count,today:today}

	Inte.today res.locals.userid,(err,resutls)->
		ep.emit "today",resutls
	User.getUserById res.locals.userid,(err,resutls)->
		ep.emit "user",resutls
	Inte.getInteAll res.locals.userid,(err,resutls)->
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
		
		Warehouse.getByUserId res.locals.userid,(err,ihas)->
			if ihas?
				re.reason = ihas._id
				res.send re
			else
				if lots? and inte >= lots.inte
					Warehouse.getOne lots._id,(err,lot)->
						if lot?
							lot.usedby = res.locals.userid
							lot.used = true
							used_at = new Date()
							lot.save()
							# res.send re
							re.reason = lot._id
							Inte.newInte res.locals.userid,-lots.inte,"兑换奖品:"+lot._id,(err,int)->

								res.send re
						else
							re.recode = 201
							re.reason = "此奖品已经被兑换光了,请等待补充."
							res.send re

				else
					re.recode = 201
					re.reason = "积分不足,无法兑换."
					res.send re
		# Warehouse.getOne id,(err,lot)->


	Lots.getById id,(err,lots)->
		ep.emit "lots",lots

	Inte.getInteAll res.locals.userid,(err,resutls)->
		ep.emit "inte",resutls
# 我的奖品
exports.mylot = (req,res,next)->
	res.locals.menu_exchange = "active"
	id = req.params.lot_id
	Warehouse.getById id,(err,lot)->
		if lot? and lot.usedby+"" is res.locals.userid
			res.render "elot",{lot:lot}
		else
			res.render "elot",{lot:null}



# 论坛
exports.topic = (req,res,next)->
	
	# tid = req.params.topic_id
	Topic.getOne (err,topic)->
		if topic?
			Comment.getByTopic topic._id,(err,comments)->
				# console.log topic,comments
				res.render "topic",{topic:topic,comments:comments}
				topic.view += 1
				topic.save()
		else
			res.render "topic",{topic:null}
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
			User.getUserById res.locals.userid,(err,user)->
				if user?
					reg = /(\d{3})\d{4}(\d{4})/
					name = user.mobile.replace reg,"$1****$2"
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



# 初始化一个话题
setDefaultTopic = ->
	list = ["工地重金属男孩","宁财神发表道歉信","测试话题1","测试话题947","话题是23"]

	name = list[Math.ceil(Math.random()*4)]
	description = "简介"
	lot = "UME电影票2张"
	startime = new Date()
	endtime  = new Date new Date().getTime()+1000*60*60*2
	Topic.getOne (err,t)->
		if not t?
			Topic.newTopic name,description,lot,startime,endtime,(err,topic)->
				console.log "初始化了一个话题"	

# 设置初始化奖项.
setsomeDefautleLots = ()->
	Lots.getLots (err,list)->
		if list? and list.length > 0
			# console.log "奖品列表,存在"
		else
			console.log "初始化了一些奖品"
			name = "爱奇艺VIP一个月"
			description = "爱奇艺VIP一个月"
			img = "/img/pro-1.png"
			order = 1
			inte = 15
			Lots.newlots name,description,img,order,inte,(err,lots)->
				if lots?
					Warehouse.newlot lots._id,"lkjsdf0923f",(err,lot)->
					Warehouse.newlot lots._id,"873498sidf1",(err,lot)->
					Warehouse.newlot lots._id,"as8979dfsdf",(err,lot)->
					Warehouse.newlot lots._id,"xcvkdo82732",(err,lot)->