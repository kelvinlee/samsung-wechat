var sign,wechat;wechat=require("./controllers/wechat"),sign=require("./controllers/sign"),module.exports=function(g){return g.get("/",wechat.index),g.post("/",wechat.index),g.get("/menu",wechat.sendmenu),g.get("/page1",sign.page1),g.get("/page2",sign.page2),g.get("/page3",sign.page3),g.get("/page4",sign.page4),g.get("/page5",sign.page5),g.get("/page6",sign.page6),g.get("/page7",sign.page7),g.get("/art/:art_id",sign.art),g.get("/login",sign["in"]),g.post("/login/in",sign.in_post),g.get("/reg",sign.up),g.post("/reg/up",sign.up_post),g.get("/sign/*",sign.before),g.post("/sign/*",sign.before),g.get("/sign/my",sign.my),g.get("/sign/mylot/:lot_id",sign.mylot),g.get("/sign/exchange",sign.exchange),g.get("/sign/exchange/:type_id",sign.exchange_type),g.get("/sign/exchangelot/:lots_id",sign.exchangelot),g.get("/sign/lucky",sign.lucky),g.get("/sign/tointe",sign.tointe),g.get("/sign/topic",sign.topic),g.post("/sign/comment",sign.comment),g.get("/sign/comments",sign.comments)},console.log("routes loaded.");