

# 基本类库
fs = require 'fs'
path = require 'path'
crypto = require 'crypto'
xml2js = require 'xml2js'
# 扩展类库
BufferHelper = require 'bufferhelper'
EventProxy = require 'eventproxy'
config = require('../config').config

plugs = require('./wechat-plugs')

# 扩展方法
# @codekit-append "wechat-subscribe.coffee";
# @codekit-append "wechat-menu.coffee";
# @codekit-append "wechat-qa.coffee";
# 
# 检查签名
checkSignature = (query, token)->
	signature = if query.signature? then query.signature else ''
	timestamp = if query.timestamp? then query.timestamp else ''
	nonce = if query.nonce? then query.nonce else ''
	shasum = crypto.createHash 'sha1'
	arr = [token, timestamp, nonce].sort()
	shasum.update arr.join ''
	# console.log arr,arr.join ''
	shasum.digest('hex') is signature

# buffer message to string.
getMessage = (stream, callback)->
	buf = new BufferHelper()
	buf.load stream, (err,buf)->
		return callback err if err
		xml = buf.toString 'utf-8'
		xml2js.parseString xml, {trim:true} , callback

# 格式化 message
formatMessage = (result)->
	message = {} 
	return false if not result
	for key of result.xml
		val = result.xml[key][0]
		message[key] = (if not val? then '' else val).trim()
	message

# 检查消息类型
checkMessage = (message,callback)->
	re = null
	switch message.MsgType
		when 'text'
			console.log '文字信息'
			return getQA message.Content,message.FromUserName,callback
		when 'image'
			console.log '图片信息'
			return callback re
		when 'voice'
			# Recognition 开启语音识别,返回对应中文.
			console.log '声音信息'
			return callback re
			# return tranStr message, go_process message.Recognition,callback
		when 'video'
			console.log '视频信息'
			return callback re
		when 'location'
			console.log '地理信息'
			return callback re
		when 'link'
			console.log '链接消息'
			return callback re

		when 'event'
			console.log '事件消息'
			# subscribe 关注
			# unsubscribe 取消关注
			# CLICK 菜单点击
			# LOCATION 地利位置
			console.log message.Event
			return plugs_subscribe message,callback if message.Event is 'subscribe'
			return plugs_menu message,callback if message.Event is 'CLICK' or message.Event is 'VIEW'
			return callback re
	callback re
	

exports.sendmenu = (req,res,next)->
	plugs.sendMenus()
	res.send "ok"

exports.index = (req,res,next)->
	# check 验证信息,并返回正确的对应格式.
	parse = req.query
	to = checkSignature parse,config.wechat_token

	ep = new EventProxy.create "message","backMsg",(message,backMsg)->
		
		console.log "run backMsg"
		if backMsg?
			switch backMsg.type
				when 'text'
					backMsg.content = backMsg.random[Math.round(Math.random()*(backMsg.random.length-1))] if backMsg.random?
					res.render 'wechat/wechat-text',
						toUser:message.FromUserName
						fromUser:message.ToUserName
						date: new Date().getTime()
						content: backMsg.content
				when 'news'
					res.render 'wechat/wechat-news',
						toUser:message.FromUserName
						fromUser:message.ToUserName
						date: new Date().getTime()
						items: backMsg.items
						# title:backMsg.title
						# description:backMsg.description
						# picurl:backMsg.picurl
						# url:backMsg.url
				else
					res.render 'wechat/wechat-text',
						toUser:message.FromUserName
						fromUser:message.ToUserName
						date: new Date().getTime()
						content: ""
		else
			res.render 'wechat/wechat-text',
				toUser:message.FromUserName
				fromUser:message.ToUserName
				date: new Date().getTime()
				content: ""

	# check message.
	getMessage req, (err,result)->
		console.log err if err
		# console.log result
		(return res.send if to then parse.echostr else "what?" ) if not result
		message = formatMessage result
		ep.emit 'message', message
		# console.log "session:",user[message.FromUserName]

		checkMessage message, (back)->
			console.log "back To: ",back
			ep.emit 'backMsg',back