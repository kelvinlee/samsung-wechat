models = require './base'
Topic = models.Topic

exports.getOne = (callback)->
	# $gte 大于等于
	st = new Date()
	# Topic.findOne {start_at:{$lt:st}},callback
	Topic.findOne {start_at:{$lt:new Date()},end_at:{$gte:new Date()}},callback

exports.getById = (id,callback)->
	Topic.findOne {_id:id},callback

exports.getTopic = (callback)->
	Topic.find({}).sort({order:-1}).exec callback

exports.newTopic = (name,description,lot,startime,endtime,callback)->
	l = new Topic()
	l.name = name
	l.description = description
	l.lot = lot
	l.start_at = startime
	l.end_at = endtime
	l.save callback
