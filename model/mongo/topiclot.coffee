models = require './base'
TopicLot = models.TopicLot

exports.getTopiclotList = (callback)->
	TopicLot.find {},callback

exports.getTopiclot = (uid,callback)->
	TopicLot.find {uid:uid},callback

exports.getId = (id,callback)->
	TopicLot.findOne {_id:id},callback


exports.newtopiclot = (nickname,uid,topiclot,callback)->
	console.log nickname,uid,lot
	lot = new TopicLot()
	lot.nickname = nickname
	lot.uid = uid
	lot.lot = topiclot
	lot.save callback