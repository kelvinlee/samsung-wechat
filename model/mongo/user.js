// Generated by CoffeeScript 1.7.1
var User, models;

models = require('./base');

User = models.User;

exports.findByMobile = function(mobile, callback) {
  return User.findOne({
    mobile: mobile
  }, callback);
};

exports.login = function(mobile, password, callback) {
  return User.findOne({
    mobile: mobile,
    password: password
  }, callback);
};

exports.getUserById = function(id, callback) {
  return User.findOne({
    _id: id
  }, callback);
};

exports.getUserOpenId = function(openid, callback) {
  return User.findOne({
    openid: openid
  }, callback);
};

exports.findByNickname = function(nickname, callback) {
  return User.findOne({
    nickname: nickname
  }, callback);
};

exports.getUsersByQuery = function(query, opt, callback) {
  return User.find(query, null, opt, callback);
};

exports.getUserByNickname = function(nickname, callback) {
  return User.findOne({
    nickname: nickname
  }, callback);
};

exports.regbyOpenId = function(openid, callback) {
  var user;
  user = new User();
  user.openid = openid;
  user.active = true;
  return user.save(callback);
};

exports.newAndSave = function(mobile, password, callback) {
  var user;
  user = new User();
  user.mobile = mobile;
  user.password = password;
  user.active = true;
  return user.save(callback);
};
