models = require './base'
Inte = models.Inte

exports.getInteAll = (userid,callback)->
	Inte.aggregate
		$group:{_id:{userid:"$userid"},total:{$sum:"$inte"}}
	.exec (err,list)->
		count = 0
		for a in list
			count = a.total if a._id.userid+"" is userid+""
		callback null,count

exports.today = (userid,callback)->
	now = new Date()
	star = new Date now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate()+" 00:00:00"
	end = new Date now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate()+" 23:59:59"
	Inte.find {create_at:{$gte:star,$lt:end},userid:userid},callback
	
exports.newInte = (userid,inte,action,callback)->
	i = new Inte()
	i.userid = userid
	i.inte = inte
	i.action = action
	i.save callback