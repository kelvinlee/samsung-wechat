LotsSchema = new Schema({
  name:{type:String}
  description:{type:String}
  img:{type:String}
  order:{type:Number}
  inte:{type:Number}
  create_at: {type:Date, default:new Date()}
})

Lots = mongoose.model('Lots', LotsSchema)

exports.Lots = Lots