var Authorize_Url,Comment,EventProxy,Inte,Lots,Topic,User,Warehouse,config,crypto,fs,helper,https,path,plugs,regs,setDefaultTopic,setsomeDefautleLots,tointe,url;fs=require("fs"),path=require("path"),crypto=require("crypto"),EventProxy=require("eventproxy"),config=require("../config").config,https=require("https"),url=require("url"),plugs=require("./wechat-plugs"),helper=require("../lib/helper"),User=require("../model/mongo").User,Inte=require("../model/mongo").Inte,Lots=require("../model/mongo").Lots,Warehouse=require("../model/mongo").Warehouse,Topic=require("../model/mongo").Topic,Comment=require("../model/mongo").Comment,Authorize_Url="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+config.APPID+"&redirect_uri={url}&response_type=code&scope=snsapi_userinfo&state={state}#wechat_redirect",regs=function(e,n,r){var o;return console.log("regs"),o=new EventProxy.create("token","info",function(e,o){return console.log("返回的用户信息:",e,o),n.cookie("regs",null),null!=o&&null!=o.errcode?n.send({error:"授权失败."}):(n.locals.openid=e.openid,User.getUserOpenId(e.openid,function(n,t){return null!=t?r():User.newAndSave(e.openid,o.nickname,o.sex,o.province,o.country,o.headimgurl,function(e,n){return r()})}))}),null!=e.cookies.regs&&"now"===e.cookies.regs?null!=e.query.code?plugs.getUToken(e.query.code,function(e){return e.on("data",function(e){var n;return n=JSON.parse(e),o.emit("token",n),plugs.getAuUserInfo(n.access_token,n.openid,function(e){return e.on("data",function(e){var n;return n=JSON.parse(e),o.emit("info",n)})})})}):(o.emit("token",null),o.emit("info",null)):r()},exports.regs=regs,exports.before=function(e,n,r){return console.log("check user"),n.locals.menu_my="",n.locals.menu_lucky="",n.locals.menu_exchange="",setsomeDefautleLots(),setDefaultTopic(),null!=e.cookies.userid&&"undefined"!==e.cookies.userid&&""!==e.cookies.userid?(n.locals.userid=e.cookies.userid,r()):n.redirect("/login")},exports.up=function(e,n,r){return n.render("reg")},exports.up_post=function(e,n,r){var o,t,u,s,i;return i=new helper.recode,t=e.body.mobile,u=e.body.password,s=e.body.passwordc,o=/^[1][3-8]\d{9}$/,o.test(t)?u!==s?(i.recode=201,i.reason="两次密码不同,请重新输入.",n.send(i)):User.findByMobile(t,function(e,r){return null!=r?(i.recode=201,i.reason="此手机号已经注册过了.",n.send(i)):User.newAndSave(t,u,function(e,r){return n.send(i)})}):(i.recode=201,i.reason="请验证手机号码格式",n.send(i))},exports["in"]=function(e,n,r){return n.render("login")},exports.in_post=function(e,n,r){var o,t,u,s;return s=new helper.recode,t=e.body.mobile,u=e.body.password,o=/^[1][3-8]\d{9}$/,o.test(t)?User.login(t,u,function(e,r){return null!=r?(r.update_at=new Date,r.save(),n.cookie("userid",r._id),n.send(s)):(s.recode=201,s.reason="手机号码或密码错误.",n.send(s))}):(s.recode=201,s.reason="请验证手机号码格式",n.send(s))},tointe=function(e,n,r){var o;return o=new helper.recode,null==n.locals.userid?(o.recode=201,o.reason="请先登录.",n.send(o),""):Inte.today(n.locals.userid,function(e,r){return null!=r&&r.length<=0?Inte.newInte(n.locals.userid,20,"签到",function(e,r){return console.log("签到成功:",r),n.send(o)}):(o.recode=201,o.reason="今天已经签到过了.",n.send(o))})},exports.tointe=tointe,exports.my=function(e,n,r){var o;return n.locals.menu_my="active",console.log("userid:",n.locals.userid),o=new EventProxy.create("user","inte","today",function(e,r,o){var t;return t=r,n.render("my",{user:e,inte:t,today:o})}),Inte.today(n.locals.userid,function(e,n){return o.emit("today",n)}),User.getUserById(n.locals.userid,function(e,n){return o.emit("user",n)}),Inte.getInteAll(n.locals.userid,function(e,n){return o.emit("inte",n)})},exports.exchange=function(e,n,r){return n.locals.menu_exchange="active",n.render("exchange")},exports.exchange_type=function(e,n,r){return n.locals.menu_exchange="active",console.log(e.params.type_id),Lots.getLots(function(e,r){return n.render("exchange-type",{list:r})})},exports.exchangelot=function(e,n,r){var o,t,u;return n.locals.menu_exchange="active",t=e.params.lots_id,u=new helper.recode,console.log(e.query),console.log(e.params),o=new EventProxy.create("inte","lots",function(e,r){return console.log(r,e),Warehouse.getByUserId(n.locals.userid,function(o,t){return null!=t?(u.reason=t._id,n.send(u)):null!=r&&e>=r.inte?Warehouse.getOne(r._id,function(e,o){var t;return null!=o?(o.usedby=n.locals.userid,o.used=!0,t=new Date,o.save(),u.reason=o._id,Inte.newInte(n.locals.userid,-r.inte,"兑换奖品:"+o._id,function(e,r){return n.send(u)})):(u.recode=201,u.reason="此奖品已经被兑换光了,请等待补充.",n.send(u))}):(u.recode=201,u.reason="积分不足,无法兑换.",n.send(u))})}),Lots.getById(t,function(e,n){return o.emit("lots",n)}),Inte.getInteAll(n.locals.userid,function(e,n){return o.emit("inte",n)})},exports.mylot=function(e,n,r){var o;return n.locals.menu_exchange="active",o=e.params.lot_id,Warehouse.getById(o,function(e,r){return null!=r&&r.usedby+""===n.locals.userid?n.render("elot",{lot:r}):n.render("elot",{lot:null})})},exports.getlucky=function(e,n,r){var o;return o=new helper.recode,n.send(o)},exports.topic=function(e,n,r){return Topic.getOne(function(e,r){return null!=r?Comment.getByTopic(r._id,function(e,o){return n.render("topic",{topic:r,comments:o}),r.view+=1,r.save()}):n.render("topic",{topic:null})})},exports.comment=function(e,n,r){var o,t;return o=e.body.comment,t=new helper.recode,null==o||""===o?(t.recode=201,t.reason="评论内容不能为空",n.send(t)):Topic.getOne(function(e,r){return null!=r?User.getUserById(n.locals.userid,function(e,u){var s,i;return null!=u?(i=/(\d{3})\d{4}(\d{4})/,s=u.mobile.replace(i,"$1****$2"),Comment.newComment(u._id,r._id,s,o,function(e,r){return null!=r?n.send(t):(t.recode=201,t.reason="评论失败,请重试",n.send(t))})):(t.recode=201,t.reason="还没登陆,无法评论",n.send(t))}):void 0})},exports.comments=function(e,n,r){var o,t;return o=new helper.recode,o.comments=[],t=e.query.startime,t=null!=t?new Date(parseInt(t)):new Date,Topic.getOne(function(e,r){return null!=r?Comment.getByTopic(r._id,function(e,r){return o.comments=r,n.send(o)}):n.send(o)})},exports.lucky=function(e,n,r){return n.locals.menu_lucky="active",n.render("lucky")},exports.art=function(e,n,r){var o;return o="active-"+e.params.art_id,n.render("art",{art:o})},exports.page1=function(e,n,r){return n.render("page1")},exports.page2=function(e,n,r){return n.render("page2")},exports.page3=function(e,n,r){return n.render("page3")},exports.page4=function(e,n,r){return n.render("page4")},exports.page5=function(e,n,r){return n.render("page5")},exports.page6=function(e,n,r){return n.render("page6")},exports.page7=function(e,n,r){return n.render("page7")},setDefaultTopic=function(){var e,n,r,o,t,u;return r=["工地重金属男孩","宁财神发表道歉信","测试话题1","测试话题947","话题是23"],t=r[Math.ceil(4*Math.random())],e="简介",o="UME电影票2张",u=new Date,n=new Date((new Date).getTime()+72e5),Topic.getOne(function(r,s){return null==s?Topic.newTopic(t,e,o,u,n,function(e,n){return console.log("初始化了一个话题")}):void 0})},setsomeDefautleLots=function(){return Lots.getLots(function(e,n){var r,o,t,u,s;return null!=n&&n.length>0?void 0:(console.log("初始化了一些奖品"),u="爱奇艺VIP一个月",r="爱奇艺VIP一个月",o="/img/pro-1.png",s=1,t=15,Lots.newlots(u,r,o,s,t,function(e,n){return null!=n?(Warehouse.newlot(n._id,"lkjsdf0923f",function(e,n){}),Warehouse.newlot(n._id,"873498sidf1",function(e,n){}),Warehouse.newlot(n._id,"as8979dfsdf",function(e,n){}),Warehouse.newlot(n._id,"xcvkdo82732",function(e,n){})):void 0}))})};