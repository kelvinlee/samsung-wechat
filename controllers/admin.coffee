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
TopicLot = require('../model/mongo').TopicLot

# 需要授权
Authorize_Url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=#{config.APPID}&redirect_uri={url}&response_type=code&scope=snsapi_userinfo&state={state}#wechat_redirect"
Noconcern = "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200560267&idx=1&sn=ff18fdd9bbf0efe2dde9ccc8d3028fb4#rd"



exports.lucky = (req,res,next)->
	Warehouse.winnerlist (err,resultes)->
		res.render "admin/lucky",{"lucky":resultes}
		

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

exports.topic = (req,res,next)->
	# 设置话题
	Topic.getOne (err,t)->
		if t?
			Comment.getByTopic t._id,(err,comments)->
				res.render "admin/topic",{topic:t,comments:comments}
		else
			res.render "admin/topic",{topic:t}

exports.delcomment = (req,res,next)->
	# 删除留言
	id = req.params.c_id
	Comment.delById id , (err,c)->
		# console.log err,c
	res.redirect "/admin/topic"
	
exports.newtopic = (req,res,next)->
	res.render "admin/newtopic"

exports.deltopic = (req,res,next)->
	# 删除留言
	id = req.params.t_id
	Topic.getById id , (err,t)->
		# console.log err,c
		t.remove()
	res.redirect "/admin/topic"

exports.topiclot = (req,res,next)->
	nickname = req.body.nickname
	User.getUserByNickname nickname,(err,resultes)->
		res.render "admin/topiclot",{list:resultes}

exports.topiclotlist = (req,res,next)->
	TopicLot.getTopiclotList (err,list)->
		res.render "admin/topiclotlist",{list:list}

# 初始化一个话题
exports.setDefaultTopic = (req,res,next)->
	# 标题
	name = req.body.name
	# 简介
	description = req.body.description
	# 奖品
	lot = req.body.lot
	# 上期中奖用户
	prelot = req.body.prelot

	startime = new Date(req.body.startime)
	endtime  = new Date(req.body.endtime)

	re = new helper.recode()

	if not name? or name is ""
		re.recode = 201
		re.reason = "标题不能为空"
	if not description? or description is ""
		re.recode = 201
		re.reason = "简介不能为空"
	if not lot? or lot is ""
		re.recode = 201
		re.reason = "如果没有奖品,请填写无"
	if not prelot? or prelot is ""
		re.recode = 201
		re.reason = "如果没有中奖名单,请填写无"

	if re.recode isnt 200
		res.send re
		return false

	Topic.newTopic name,description,lot,prelot,startime,endtime,(err,topic)->
		console.log "创建了一个话题"
		res.send re

