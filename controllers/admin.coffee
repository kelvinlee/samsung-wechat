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



exports.addlot = (req,res,next)->
	Lots.getLots (err,list)->
		res.render "admin/addlot",{list:list}

exports.postaddlot = (req,res,next)->
	# Lots.getLots (err,list)->
		# res.render "admin/addlot",{list:list}
	re = new helper.recode()
	console.log req.params.lot_type
	list = req.body.lots.split("\r\n");

	for a in list
		if a? and a isnt ""
			Warehouse.newlot req.params.lot_type,a,(err,lot)->
	res.send re





