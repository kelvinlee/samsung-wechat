models = require './base'
Inte = models.Inte

exports.getInteAll = (openid,callback)->
	Inte.aggregate
		$group:{_id:{openid:"$openid"},total:{$sum:"$inte"}}
	.exec callback

exports.today = (openid,callback)->
	now = new Date()
	star = new Date now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate()+" 00:00:00"
	end = new Date now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate()+" 23:59:59"
	Inte.find {create_at:{$gte:star,$lt:end},openid:openid},callback
	
exports.newInte = (openid,inte,action,callback)->
	i = new Inte()
	i.openid = openid
	i.inte = inte
	i.action = action
	i.save callback