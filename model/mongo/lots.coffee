models = require './base'
Lots = models.Lots


exports.getById = (id,callback)->
	Lots.findOne {_id:id},callback

exports.getLots = (callback)->
	Lots.find({}).sort({order:1}).exec callback

# Lots.newlots name,description,img,order,inte,info_a,info_b,info_c,headerimg,descriptionimg,(err,lots)->
exports.newlots = (name,description,img,order,inte,info_a,info_b,info_c,headerimg,descriptionimg,callback)->
	l = new Lots()
	l.name = name
	l.description = description
	l.img = img
	l.info_a = info_a
	l.info_b = info_b
	l.info_c = info_c
	l.headerimg = headerimg
	l.descriptionimg = descriptionimg
	l.order = order
	l.inte = inte
	l.save callback
