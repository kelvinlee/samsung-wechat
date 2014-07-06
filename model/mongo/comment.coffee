models = require './base'
Comment = models.Comment

exports.getByTopic = (tid,callback)->
	# $gte 大于等于
	Comment.find({topic:tid}).sort({create_at:-1}).limit(200).exec callback

exports.getByTime = (tid,startime,callback)->

	Comment.find({topic:tid}).sort({create_at:-1}).limit(200).exec callback

exports.newComment = (uid,topic,name,content,callback)->
	l = new Comment()
	l.uid = uid
	l.topic = topic
	l.name = name
	l.content = content
	l.save callback
