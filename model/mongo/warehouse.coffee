models = require './base'
Warehouse = models.Warehouse

exports.getByUserId = (id,lid,callback)->
	Warehouse.findOne {usedby:id,info:lid},callback
exports.getById = (id,callback)->
	Warehouse.findOne {_id:id},callback
exports.getOne = (id,callback)->
	Warehouse.findOne {info:id,used:false},callback
exports.setBy = (uid,id,callback)->
	Warehouse.findOne {usedby:uid,_id:id},callback

exports.newlot = (info,content,callback)->
	l = new Warehouse()
	l.info = info
	l.content = content
	l.save callback