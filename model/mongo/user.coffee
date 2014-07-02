models = require './base'
User = models.User


exports.getUserById = (id, callback)->
	User.findOne {_id:id}, callback 
exports.getUserOpenId = (openid, callback)->
  User.findOne {openid:openid}, callback 
exports.getUsersByQuery = (query, opt, callback)->
	User.find query, null, opt, callback

exports.newAndSave = (openid, nickname, sex, province, city, headimgurl, callback)->
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
  user.openid = openid
  user.nickname = nickname
  user.sex = sex
  user.province = province
  user.country = city
  user.headimgurl = headimgurl
  user.active = true
  user.save callback