CommentSchema = new Schema({
	uid:{type:ObjectId,index:true,ref:"User"}
	topic:{type:ObjectId,index:true,ref:"Topic"}
	name:{type:String}
	content:{type:String}
	create_at: {type:Date, default:new Date(),index:1}
})

Comment = mongoose.model('Comment', CommentSchema)

exports.Comment = Comment