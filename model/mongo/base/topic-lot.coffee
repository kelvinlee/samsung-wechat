TopicLotSchema = new Schema({
  nickname:{type:String}
  uid:{type:ObjectId,index:true,ref:"User"}
  lot:{type:String}
  used:{type:Boolean, default:false}
  username:{type:String}
  mobile:{type:String}
  adr:{type:String}
  create_at: {type:Date, default:new Date()}
})

TopicLot = mongoose.model('TopicLot', TopicLotSchema)

exports.TopicLot = TopicLot