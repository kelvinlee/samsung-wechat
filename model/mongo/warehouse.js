// Generated by CoffeeScript 1.7.1
var Warehouse, Winner, getWinnerById, getWinnerByLotAndUid, getWinnerByUid, models, winnerlist;

models = require('./base');

Warehouse = models.Warehouse;

Winner = models.Winner;

exports.getByUserId = function(id, lid, callback) {
  return Warehouse.findOne({
    usedby: id,
    info: lid
  }, callback);
};

exports.getById = function(id, callback) {
  return Warehouse.findOne({
    _id: id
  }, callback);
};

exports.getOne = function(id, callback) {
  return Warehouse.findOne({
    info: id,
    used: false
  }, callback);
};

exports.setBy = function(uid, id, callback) {
  return Warehouse.findOne({
    usedby: uid,
    _id: id
  }, callback);
};

exports.newlot = function(info, content, callback) {
  var l;
  l = new Warehouse();
  l.info = info;
  l.content = content;
  return l.save(callback);
};

exports.counts = function(callback) {
  return Winner.find().count().exec(callback);
};

exports.getWinnerByInfo = function(info, callback) {
  return Winner.findOne({
    info: info,
    used: false
  }, callback);
};

exports.getWinnerByUandW = function(uid, id, callback) {
  return Winner.findOne({
    usedby: uid,
    _id: id
  }, callback);
};

getWinnerById = function(id, callback) {
  return Winner.findOne({
    _id: id
  }, callback);
};

exports.getWinnerById = getWinnerById;

getWinnerByUid = function(id, callback) {
  return Winner.find({
    usedby: id
  }, callback);
};

exports.getWinnerByUid = getWinnerByUid;

getWinnerByLotAndUid = function(lot, uid, callback) {
  return Winner.find({
    usedby: uid,
    content: lot
  }, callback);
};

exports.getWinnerByLotAndUid = getWinnerByLotAndUid;

winnerlist = function(callback) {
  return Winner.find({
    used: true
  }).sort({
    create_at: -1
  }).exec(callback);
};

exports.winnerlist = winnerlist;

exports.updatewinner = function(id, username, mobile, adr, callback) {
  return getWinnerById(id, function(err, win) {
    if (win != null) {
      win.username = username;
      win.mobile = mobile;
      win.adr = adr;
      win.used_at = new Date();
      return win.save(callback);
    } else {
      return callback(null, null);
    }
  });
};

exports.newwinner = function(info, content, img, callback) {
  var w;
  w = new Winner();
  w.info = info;
  w.content = content;
  w.img = img;
  return w.save(callback);
};
