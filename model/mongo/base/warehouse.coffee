WarehouseSchema = new Schema({
  info:{type:ObjectId,index:true}
  content:{type:String}
  used:{type:Boolean,default:false,index:true}
  usedby:{type:ObjectId,rel:"user",index:true}
  used_at:{type:Date}
  create_at: {type:Date, default:new Date()}
})

Warehouse = mongoose.model('Warehouse', WarehouseSchema)

exports.Warehouse = Warehouse