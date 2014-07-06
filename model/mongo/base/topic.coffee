TopicSchema = new Schema({
  name:{type:String}
  description:{type:String}
  lot:{type:String}
  view:{type:Number,default:0}
  start_at: {type:Date,index:true}
  end_at:{type:Date,index:true}
  create_at: {type:Date, default:new Date()}
})

Topic = mongoose.model('Topic', TopicSchema)

exports.Topic = Topic