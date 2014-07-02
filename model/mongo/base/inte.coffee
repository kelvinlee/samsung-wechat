InteSchema = new Schema({
  openid: {type: String, index: true}
  # 积分数量,正负
  inte: {type:Number}
  only: {type:String}
  action: {type:String}
  create_at: {type:Date, default:new Date()}
})

Inte = mongoose.model('Inte', InteSchema)

exports.Inte = Inte