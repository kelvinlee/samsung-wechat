# 这个文件的作用
# 主要是发送给微信后台接口
# 获取token值,定期更新.
# 此页内的均为高级功能,需要高级权限.
# 
https = require 'https'
URL = require 'url'
querystring = require 'querystring'
config = require('../config').config


access_token = {}
# 创建菜单
options_create_menu = 
	host : "https://api.weixin.qq.com/cgi-bin/menu/create?access_token="
	method: 'POST'
# 获取菜单
options_get_menu = 
	host : "https://api.weixin.qq.com/cgi-bin/menu/get?access_token="
	method: 'GET'
# 删除菜单
options_get_menu = 
	host : "https://api.weixin.qq.com/cgi-bin/menu/delete?access_token="
	method: 'GET'
# 获取token值
options_get_access_token =
	host : "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=#{config.APPID}&secret=#{config.SECRET}"
	method : 'GET'
# 发送自定义消息 [需要各种消息类型] [注:只能是48小时内发送过消息的人,待测试长时间未操作,是否可行.]
options_custom =
	host : "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token="
	method : "POST"
# 发送消息 [Old]
options_send =
	host : "https://api.weixin.qq.com/cgi-bin/message/send?access_token="
	method : "POST"
# 获取关注列表
options_users =
	host : "https://api.weixin.qq.com/cgi-bin/user/get?access_token="
	method : "GET"
# 获取关注者信息
options_user_info =
	host : "https://api.weixin.qq.com/cgi-bin/user/info?lang=zh_CN&access_token="
	method : "GET"
# 无信息授权
# options_user =
# 	regs: "https://open.weixin.qq.com/connect/oauth2/authorize?appid=#{config.APPID}&redirect_uri=#{config.host}/sign/in&response_type=code&scope=snsapi_base&state=in#wechat_redirect"
# 	my: "https://open.weixin.qq.com/connect/oauth2/authorize?appid=#{config.APPID}&redirect_uri=#{config.host}/sign/my&response_type=code&scope=snsapi_base&state=in#wechat_redirect"
# 	exchange: "https://open.weixin.qq.com/connect/oauth2/authorize?appid=#{config.APPID}&redirect_uri=#{config.host}/sign/exchange&response_type=code&scope=snsapi_base&state=in#wechat_redirect"
# 	lucky: "https://open.weixin.qq.com/connect/oauth2/authorize?appid=#{config.APPID}&redirect_uri=#{config.host}/sign/lucky&response_type=code&scope=snsapi_base&state=in#wechat_redirect"
# 	method: "GET"
options_user =
	regs: "https://open.weixin.qq.com/connect/oauth2/authorize?appid=#{config.APPID}&redirect_uri=#{config.host}/sign/in&response_type=code&scope=snsapi_base&state=in#wechat_redirect"
	my: "#{config.host}/sign/my"
	exchange: "#{config.host}/sign/exchange"
	lucky: "#{config.host}/sign/lucky"
	topic: "#{config.host}/sign/topic"
	method: "GET"

# token 拉取
options_token =
	host: "https://api.weixin.qq.com/sns/oauth2/access_token?appid=#{config.APPID}&secret=#{config.SECRET}&code={code}&grant_type=authorization_code"
	method: "GET"

# 获取授权用户信息
options_userinfo =
	host: "https://api.weixin.qq.com/sns/userinfo?access_token={token}&openid={OPENID}&lang=zh_CN"
	method:"GET"


# for privte
# 签到url

post_data = 
	button:[
		{
			# type:"click"
			name:"游乐场"
			# key:"myself"
			sub_button: [
				{
					type:"click"
					name:"新·活动"
					key: "newactive"
				}
				{
					type:"click"
					name:"临·现场"
					key:"oversite"
				}
				{
					# type:"view"
					type:"click"
					name:"聊·话题"
					key:"topic"
					# url:options_user.topic
				}
				{
					# type:"view"
					type:"click"
					name:"试·手气"
					key:"lucky"
					# url:options_user.lucky
				}
			]
		}
		{
			# type:"click"
			name:"星专享"
			# key:"myself"
			sub_button: [
				{
					type:"click"
					name:"鉴·星品"
					key:"jianxingpin"
				}
				{
					type:"click"
					name:"看·杂志"
					key:"magazine"
				}
				{
					type:"view"
					name:"找·优惠"
					url: config.host+"/page2"
				}
				{
					# type:"view"
					type:"click"
					name:"玩·游戏"
					key:"game"
					# url:config.host+"/sign/exchange/1"
				}
			]
		}
		{
			# type:"click"
			name:"园助手"
			# key:"myself"
			sub_button: [
				{
					type:"view"
					name:"解·问题"
					url:config.host+"/page4"
				}
				{
					type:"view"
					name:"寻·合作"
					url:config.host+"/page5"
				}
				{
					# type:"view"
					type:"click"
					name:"查·积分"
					key:"my"
					# url:options_user.my
				}
				{
					# type:"view"
					type:"click"
					name:"来·签到"
					key:"regsinto"
					# url:config.host+"/page7" #options_user.regs
				}
			]
		}
	]

# 检测token值,并向下执行
checkToken = (callback)->
	if access_token.date && access_token.date > new Date().getTime()
		callback false
		return yes
	else
		getToken callback
		return false

# 发送get 请求
httpget = (url,callback)->
	request = https.get url,callback
	request.write '\n'
	request.end()

# 或者token值
getToken = (callback)->
	httpget options_get_access_token.host,(result)->
		console.log 'STATUS: '+result.statusCode
		console.log 'HEADERS: '+JSON.stringify result.headers
		result.setEncoding 'utf8'
		result.on 'data', (chunk)->
			console.log 'BODY: '+chunk
			obj = JSON.parse chunk
			if obj.access_token
				access_token = obj
				access_token.date = new Date().getTime()+obj.expires_in*1000
				callback false
			else
				callback 'There is no token' 

# 创建菜单
sendMenus = ->
	u = URL.parse options_create_menu.host
	p = if u['port'] then u['port'] else 80

	op = 
		hostname: u['host']
		port: 443
		path: u['path']+access_token.access_token
		method: 'POST'
	console.log op,p
	request = https.request op, (res)->
		console.log "statusCode: ",res.statusCode
		console.log "headers: ",res.headers

		res.on 'data', (chunk)->
			obj = JSON.parse chunk
			console.log obj
	console.log JSON.stringify post_data
	request.write JSON.stringify(post_data)+'\n'
	request.end()
exports.sendMenus = ->
	checkToken (err)->
		sendMenus()

# 获取菜单
checkMenus = -> 
	httpget options_get_menu.host+access_token.access_token, (res)->
		console.log "statusCode: ",res.statusCode
		console.log "headers: ",res.headers

		res.on 'data', (chunk)->
			obj = JSON.parse chunk
			console.log obj
exports.checkMenus = checkMenus


# 获取关注者列表
getUsers = (Next_OpenID)->
	if Next_OpenID is "start" or Next_OpenID
		httpget options_users.host+access_token.access_token, (res)->
			res.on 'data', (chunk)->
				obj = JSON.parse chunk
				console.log obj
				CheckUsers obj

exports.getUsers = getUsers

# 操作关注列表,如果过多,请求下一页.
CheckUsers = (obj)->
	if obj.next_openid
		getUsers obj.next_openid
exports.CheckUsers = CheckUsers


# 获取关注者信息
getUserInfo = (openid)->
	request = https.get options_user_info.host+access_token.access_token+"&openid="+openid, (res)->
		console.log "statusCode: ",res.statusCode
		console.log "headers: ",res.headers

		res.on 'data', (chunk)->
			obj = JSON.parse chunk
			console.log obj
	request.write '\n'
	request.end()
exports.getUserInfo = getUserInfo

getUToken = (code,callback)->
	url = options_token.host.replace "{code}",code
	httpget url,callback
exports.getUToken = getUToken

getAuUserInfo = (token,openid,callback)->
	url = options_userinfo.host.replace "{token}",token
	url = url.replace "{openid}",openid
	httpget url,callback
exports.getAuUserInfo = getAuUserInfo


