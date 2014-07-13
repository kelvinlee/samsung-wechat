models = require './base'
User = models.User

exports.findByMobile = (mobile,callback)->
  User.findOne {mobile:mobile},callback
exports.login = (mobile,password,callback)->
  User.findOne {mobile:mobile,password:password},callback
exports.getUserById = (id, callback)->
	User.findOne {_id:id}, callback 
exports.getUserOpenId = (openid, callback)->
  User.findOne {openid:openid}, callback 
exports.getUsersByQuery = (query, opt, callback)->
	User.find query, null, opt, callback

exports.regbyOpenId = (openid,callback)->
  user = new User()
  user.openid = openid
  user.active = true
  user.save callback
exports.newAndSave = (mobile,password, callback)->
  user = new User()
  # openid: {type: String, index: true}
  # nickname: {type: String}
  # sex : {type: Number, default: 0}
  # province: {type: String}
  # city: {type:String}
  # headimgurl: {type:String}
  # active: {type:Boolean, default:false}
  # update_at: {type:Date, default:new Date()}
  # create_at: {type:Date, default:new Date()}
  user.mobile = mobile
  user.password = password
  user.active = true
  user.save callback