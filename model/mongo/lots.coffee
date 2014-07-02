models = require './base'
Lots = models.Lots
Lot = models.Lot


exports.getLots = (callback)->
	Lots.find({}).sort({order:-1}).exec callback

exports.newlot = (info,content,callback)->
	l = new Lot()
	l.info = info
	l.content = content
	l.save callback
exports.newlots = (name,description,img,order,inte,callback)->
	l = new Lots()
	l.name = name
	l.description = description
	l.img = img
	l.order = order
	l.inte = inte
	l.save callback
