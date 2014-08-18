// Generated by CoffeeScript 1.7.1
var TopicLot, models;

models = require('./base');

TopicLot = models.TopicLot;

exports.getTopiclotList = function(callback) {
  return TopicLot.find({}, callback);
};

exports.getTopiclot = function(uid, callback) {
  return TopicLot.find({
    uid: uid
  }, callback);
};

exports.getId = function(id, callback) {
  return TopicLot.findOne({
    _id: id
  }, callback);
};

exports.newtopiclot = function(nickname, uid, topiclot, callback) {
  var lot;
  console.log(nickname, uid, lot);
  lot = new TopicLot();
  lot.nickname = nickname;
  lot.uid = uid;
  lot.lot = topiclot;
  return lot.save(callback);
};
