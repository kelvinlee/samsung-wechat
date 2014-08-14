models = require './base'
Warehouse = models.Warehouse
Winner = models.Winner

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



# for  winner
exports.counts = (callback)->
	Winner.find().count().exec callback
	
exports.getWinnerByInfo = (info,callback)->
	Winner.findOne {info:info,used:false},callback

exports.getWinnerByUandW = (uid,id,callback)->
	Winner.findOne {usedby:uid,_id:id},callback

getWinnerById = (id,callback)->
	Winner.findOne {_id:id},callback
exports.getWinnerById = getWinnerById

getWinnerByUid = (id,callback)->
	Winner.find {usedby:id},callback
exports.getWinnerByUid = getWinnerByUid
winnerlist = (callback)->
	Winner.find().sort({create_at:-1}).exec callback
exports.winnerlist = winnerlist

exports.updatewinner = (id,username,mobile,adr,callback)->
	getWinnerById id,(err,win)->
		if win?
			win.username = username
			win.mobile = mobile
			win.adr = adr
			win.used_at = new Date()
			win.save callback
		else
			callback null,null

exports.newwinner = (info,content,img,callback)->
	w = new Winner()
	w.info = info
	w.content = content
	w.img = img
	w.save callback