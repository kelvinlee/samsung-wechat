LotSchema = new Schema({
  info:{type:ObjectId}
  content:{type:String}
  used:{type:Boolean,default:false}
  usedby:{type:ObjectId,rel:"user"}
  used_at:{type:Date}
  create_at: {type:Date, default:new Date()}
})

Lot = mongoose.model('Lot', LotSchema)

exports.Lot = Lot