// Generated by CoffeeScript 1.7.1
var Inte, models;

models = require('./base');

Inte = models.Inte;

exports.getInteAll = function(userid, callback) {
  return Inte.aggregate({
    $group: {
      _id: {
        userid: "$userid"
      },
      total: {
        $sum: "$inte"
      }
    }
  }).exec(function(err, list) {
    var a, count, _i, _len;
    count = 0;
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      a = list[_i];
      if (a._id.userid + "" === userid + "") {
        count = a.total;
      }
    }
    return callback(null, count);
  });
};

exports.getInteAction = function(action, callback) {
  return Inte.find({
    action: action
  }).count().exec(callback);
};

exports.today = function(userid, callback) {
  var end, now, star;
  now = new Date();
  star = new Date(now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + " 00:00:00");
  end = new Date(now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + " 23:59:59");
  console.log("time: " + star + " / " + end);
  return Inte.find({
    create_at: {
      $gte: star,
      $lt: end
    },
    action: "regs",
    userid: userid
  }, callback);
};

exports.newInte = function(userid, inte, action, callback) {
  var i;
  i = new Inte();
  i.userid = userid;
  i.inte = inte;
  i.action = action;
  return i.save(callback);
};
