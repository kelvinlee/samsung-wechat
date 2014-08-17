models = require './base'
TopicLot = models.TopicLot

exports.getTopiclotList = (callback)->
	TopicLot.find {},callback

exports.getTopiclot = (uid,callback)->
	TopicLot.find {uid:uid},callback

exports.newtopiclot = (nickname,uid,callback)->
	lot = new TopicLot()
	lot.nickname = nickname
	lot.uid = uid
	lot.save callback