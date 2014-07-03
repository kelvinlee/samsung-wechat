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

# 需要授权
Authorize_Url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=#{config.APPID}&redirect_uri={url}&response_type=code&scope=snsapi_userinfo&state={state}#wechat_redirect"


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
exports.before = (req,res,next)->
	# console.log "before"
	res.locals.menu_my = ""
	res.locals.menu_lucky = ""
	res.locals.menu_exchange = ""
	# console.log "cookie:",req.cookies
	if req.cookies.openid? and req.cookies.openid isnt "undefined"
		res.locals.openid = req.cookies.openid
		return next()
	if req.cookies.regs? and req.cookies.regs is "now"
		return regs req,res,next

	ep = new EventProxy.create "token","user",(token,user)->
		console.log token,token.openid
		if token.openid?
			res.cookie "openid",token.openid
			res.locals.openid = token.openid
		else
			return res.send {error:"授权失败"}
		if user?
			# res.send "ok code:#{req.query.code}"
			next()
		else
			url = req.originalUrl
			state = req.query.state
			url = url.split("?")[0]

			newurl = Authorize_Url
			href = encodeURIComponent config.host+url
			state = newurl.replace "{state}",state

			res.cookie "regs","now"
			res.render "authorize",{url:newurl,href:href,state:state}
		
	if req.query.code?
		plugs.getUToken req.query.code,(reb)->
			reb.on 'data', (chunk)->
				obj = JSON.parse chunk
				ep.emit "token",obj
				if obj.openid?
					User.getUserOpenId obj.openid,(err,resutls)->
						ep.emit "user",resutls
				else
					ep.emit "user",null
	else
		res.send {error:"授权失败."}
		# next()

exports.up = (req,res,next)->
	
exports.in = (req,res,next)->
	console.log req.cookies.openid
	plugs.sendMenus()

	tointe req,res,next
	# res.send "ok"

tointe = (req,res,next)->
	re = new helper.recode()
	Inte.today res.locals.openid,(err,today)->
		if today? and today.length<=0
			Inte.newInte res.locals.openid,20,"签到",(err,resutls)->
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
	console.log "openid:",res.locals.openid
	ep = new EventProxy.create "user","inte","today",(user,inte,today)->
		# console.log user,inte
		# console.log today
		# 
		# res.send {user:user,inte:inte,today:today}
		count = 0
		for a in inte
			# console.log res.locals.openid,a._id.openid+"" is res.locals.openid+""
			count = a.total if a._id.openid+"" is res.locals.openid+""
		res.render "my",{user:user,inte:count,today:today}

	Inte.today req.cookies.openid,(err,resutls)->
		ep.emit "today",resutls
	User.getUserOpenId req.cookies.openid,(err,resutls)->
		ep.emit "user",resutls
	Inte.getInteAll req.cookies.openid,(err,resutls)->
		ep.emit "inte",resutls

exports.exchange = (req,res,next)->
	res.locals.menu_exchange = "active"
	res.render "exchange"
exports.exchange_type = (req,res,next)->
	res.locals.menu_exchange = "active"
	console.log req.query.type_id
	res.render "exchange-type"
exports.lucky = (req,res,next)->


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
