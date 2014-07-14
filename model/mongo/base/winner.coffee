WinnerSchema = new Schema({
  info:{type:String,index:true}
  content:{type:String}
  img:{type:String}
  username:{type:String}
  mobile:{type:String}
  adr:{type:String}
  used:{type:Boolean,default:false,index:true}
  usedby:{type:ObjectId,rel:"user",index:true}
  used_at:{type:Date}
  create_at: {type:Date, default:new Date()}
})

Winner = mongoose.model('Winner', WinnerSchema)

exports.Winner = Winner