// Generated by CoffeeScript 1.7.1
var admin, sign, wechat;

wechat = require('./controllers/wechat');

sign = require('./controllers/sign');

admin = require('./controllers/admin');

module.exports = function(app) {
  app.get('/', wechat.index);
  app.post('/', wechat.index);
  app.get('/menu', wechat.sendmenu);
  app.get("/page1", sign.page1);
  app.get("/page2", sign.page2);
  app.get("/page3", sign.page3);
  app.get("/page4", sign.page4);
  app.get("/page5", sign.page5);
  app.get("/page6", sign.page6);
  app.get("/page7", sign.page7);
  app.get("/page8", sign.page8);
  app.get("/game", sign.game);
  app.get("/share/:info", sign.share);
  app.get("/art/:art_id", sign.art);
  app.get("/active/:ac_id", sign.active);
  app.get("/middle/:openid", sign.middle);
  app.get("/login", sign["in"]);
  app.post("/login/in", sign.in_post);
  app.get("/reg", sign.up);
  app.post("/reg/up", sign.up_post);
  app.get("/sign/*", sign.before);
  app.post("/sign/*", sign.before);
  app.get("/sign/my", sign.my);
  app.get("/sign/mylot/:lot_id", sign.mylot);
  app.get("/sign/exchange", sign.exchange);
  app.get("/sign/exchange/:type_id", sign.exchange_type);
  app.get("/sign/exchangelot/:lots_id", sign.exchangelot);
  app.get("/sign/lucky", sign.lucky);
  app.get("/sign/getlucky", sign.getlucky);
  app.get("/sign/luckyframe", sign.luckyframe);
  app.get("/sign/tointe", sign.tointe);
  app.get("/sign/topic", sign.topic);
  app.post("/sign/comment", sign.comment);
  app.get("/sign/comments", sign.comments);
  app.get("/nickname", sign.nickname);
  app.post("/sign/nickname", sign.postnickname);
  app.get("/sign/lots", sign.lots);
  app.get("/sign/winner/:winner_id", sign.winner);
  app.post("/sign/winner/:winner_id", sign.winner_post);
  app.get("/admin/lot", admin.addlot);
  return app.post("/admin/lot/:lot_type", admin.postaddlot);
};

console.log("routes loaded.");
