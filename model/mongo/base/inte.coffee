InteSchema = new Schema({
	userid: {type:ObjectId, ref:"User", index:true}
  # openid: {type: String, index: true}
  # 积分数量,正负
	inte: {type:Number}
	only: {type:String}
	action: {type:String, index:true}
	create_at: {type:Date, default:new Date(), index:true}
})

Inte = mongoose.model('Inte', InteSchema)

exports.Inte = Inte