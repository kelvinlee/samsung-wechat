// Generated by CoffeeScript 1.7.1
var Lots, models;

models = require('./base');

Lots = models.Lots;

exports.getById = function(id, callback) {
  return Lots.findOne({
    _id: id
  }, callback);
};

exports.getLots = function(callback) {
  return Lots.find({}).sort({
    order: 1
  }).exec(callback);
};

exports.newlots = function(name, description, img, order, inte, info_a, info_b, info_c, headerimg, descriptionimg, callback) {
  var l;
  l = new Lots();
  l.name = name;
  l.description = description;
  l.img = img;
  l.info_a = info_a;
  l.info_b = info_b;
  l.info_c = info_c;
  l.headerimg = headerimg;
  l.descriptionimg = descriptionimg;
  l.order = order;
  l.inte = inte;
  return l.save(callback);
};
