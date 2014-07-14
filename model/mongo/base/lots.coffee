LotsSchema = new Schema({
  name:{type:String}
  description:{type:String}
  img:{type:String}
  headerimg:{type:String}
  descriptionimg:{type:String}
  info_a:{type:String}
  info_b:{type:String}
  info_c:{type:String}

  order:{type:Number}
  inte:{type:Number}
  create_at: {type:Date, default:new Date()}
})

Lots = mongoose.model('Lots', LotsSchema)

exports.Lots = Lots