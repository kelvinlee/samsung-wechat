UserSchema = new Schema({
	mobile: {type: String, index: {unique:true}}
	password:{type:String}
	openid: {type: String, index: {unique:true}}
	nickname: {type: String}
	sex : {type: Number, default: 0}
	province: {type: String}
	country: {type:String}
	headimgurl: {type:String}
	active: {type:Boolean, default:false}
	update_at: {type:Date, default:new Date()}
	create_at: {type:Date, default:new Date()}
})

mongoose.model('User', UserSchema)
exports.User = mongoose.model 'User'