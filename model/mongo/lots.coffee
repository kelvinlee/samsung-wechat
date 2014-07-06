models = require './base'
Lots = models.Lots


exports.getById = (id,callback)->
	Lots.findOne {_id:id},callback

exports.getLots = (callback)->
	Lots.find({}).sort({order:-1}).exec callback

exports.newlots = (name,description,img,order,inte,callback)->
	l = new Lots()
	l.name = name
	l.description = description
	l.img = img
	l.order = order
	l.inte = inte
	l.save callback
