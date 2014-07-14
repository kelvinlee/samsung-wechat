// Generated by CoffeeScript 1.7.1
var Authorize_Url, Comment, EventProxy, Inte, Lots, Topic, User, Warehouse, config, crypto, fs, helper, https, path, plugs, regs, setDefaultTopic, setsomeDefautleLots, tointe, url;

fs = require('fs');

path = require('path');

crypto = require('crypto');

EventProxy = require('eventproxy');

config = require('../config').config;

https = require('https');

url = require('url');

plugs = require('./wechat-plugs');

helper = require("../lib/helper");

User = require('../model/mongo').User;

Inte = require('../model/mongo').Inte;

Lots = require('../model/mongo').Lots;

Warehouse = require('../model/mongo').Warehouse;

Topic = require('../model/mongo').Topic;

Comment = require('../model/mongo').Comment;

Authorize_Url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + config.APPID + "&redirect_uri={url}&response_type=code&scope=snsapi_userinfo&state={state}#wechat_redirect";

regs = function(req, res, next) {
  var ep;
  console.log("regs");
  ep = new EventProxy.create("token", "info", function(token, info) {
    console.log("返回的用户信息:", token, info);
    res.cookie("regs", null);
    if ((info != null) && (info.errcode != null)) {
      return res.send({
        error: "授权失败."
      });
    }
    res.locals.openid = token.openid;
    return User.getUserOpenId(token.openid, function(err, resutls) {
      if (resutls != null) {
        return next();
      } else {
        return User.newAndSave(token.openid, info.nickname, info.sex, info.province, info.country, info.headimgurl, function(err, resutls) {
          return next();
        });
      }
    });
  });
  if ((req.cookies.regs != null) && req.cookies.regs === "now") {
    if (req.query.code != null) {
      return plugs.getUToken(req.query.code, function(reb) {
        return reb.on("data", function(chunk) {
          var obj;
          obj = JSON.parse(chunk);
          ep.emit("token", obj);
          return plugs.getAuUserInfo(obj.access_token, obj.openid, function(rebs) {
            return rebs.on("data", function(chunks) {
              var userinfo;
              userinfo = JSON.parse(chunks);
              return ep.emit("info", userinfo);
            });
          });
        });
      });
    } else {
      ep.emit("token", null);
      return ep.emit("info", null);
    }
  } else {
    return next();
  }
};

exports.regs = regs;

exports.before = function(req, res, next) {
  console.log("check user");
  res.locals.menu_my = "";
  res.locals.menu_lucky = "";
  res.locals.menu_exchange = "";
  setsomeDefautleLots();
  setDefaultTopic();
  if ((req.cookies.userid != null) && req.cookies.userid !== "undefined" && req.cookies.userid !== "") {
    res.locals.userid = req.cookies.userid;
    return next();
  } else {
    return res.redirect("/login");
  }
};

exports.middle = function(req, res, next) {
  var openid;
  openid = req.params.openid;
  url = req.query.url;
  console.log(openid, url);
  return User.getUserOpenId(openid, function(err, user) {
    if (user != null) {
      res.cookie("userid", user._id);
      console.log(url);
      return res.redirect(url);
    } else {
      return User.regbyOpenId(openid, function(err, user) {
        console.log(url);
        res.cookie("userid", user._id);
        return Inte.newInte(user._id, 100, "初次注册赠送积分活动,100积分", function(err, inte) {
          console.log("初次注册赠送积分活动,100积分");
          return res.redirect(url);
        });
      });
    }
  });
};

exports.up = function(req, res, next) {
  return res.render("reg");
};

exports.up_post = function(req, res, next) {
  var check, mobile, password, passwordc, re;
  re = new helper.recode();
  mobile = req.body.mobile;
  password = req.body.password;
  passwordc = req.body.passwordc;
  check = /^[1][3-8]\d{9}$/;
  if (!check.test(mobile)) {
    re.recode = 201;
    re.reason = "请验证手机号码格式";
    return res.send(re);
  }
  if (password !== passwordc) {
    re.recode = 201;
    re.reason = "两次密码不同,请重新输入.";
    return res.send(re);
  }
  return User.findByMobile(mobile, function(err, user) {
    if (user != null) {
      re.recode = 201;
      re.reason = "此手机号已经注册过了.";
      return res.send(re);
    } else {
      return User.newAndSave(mobile, password, function(err, newuser) {
        console.log(err, newuser);
        return res.send(re);
      });
    }
  });
};

exports["in"] = function(req, res, next) {
  return res.render("login");
};

exports.in_post = function(req, res, next) {
  var check, mobile, password, re;
  re = new helper.recode();
  mobile = req.body.mobile;
  password = req.body.password;
  check = /^[1][3-8]\d{9}$/;
  if (!check.test(mobile)) {
    re.recode = 201;
    re.reason = "请验证手机号码格式";
    return res.send(re);
  }
  return User.login(mobile, password, function(err, user) {
    if (user != null) {
      user.update_at = new Date();
      user.save();
      res.cookie("userid", user._id);
      return res.send(re);
    } else {
      re.recode = 201;
      re.reason = "手机号码或密码错误.";
      return res.send(re);
    }
  });
};

tointe = function(req, res, next) {
  var re;
  re = new helper.recode();
  if (res.locals.userid == null) {
    re.recode = 201;
    re.reason = "请先登录.";
    res.send(re);
    return "";
  }
  return Inte.today(res.locals.userid, function(err, today) {
    if ((today != null) && today.length <= 0) {
      return Inte.newInte(res.locals.userid, 20, "regs", function(err, resutls) {
        console.log("签到成功:", resutls);
        return res.send(re);
      });
    } else {
      re.recode = 201;
      re.reason = "今天已经签到过了.";
      return res.send(re);
    }
  });
};

exports.tointe = tointe;

exports.my = function(req, res, next) {
  var ep;
  res.locals.menu_my = "active";
  console.log("userid:", res.locals.userid);
  ep = new EventProxy.create("user", "inte", "today", function(user, inte, today) {
    var count;
    count = inte;
    return res.render("my", {
      user: user,
      inte: count,
      today: today
    });
  });
  Inte.today(res.locals.userid, function(err, resutls) {
    return ep.emit("today", resutls);
  });
  User.getUserById(res.locals.userid, function(err, resutls) {
    return ep.emit("user", resutls);
  });
  return Inte.getInteAll(res.locals.userid, function(err, resutls) {
    return ep.emit("inte", resutls);
  });
};

exports.exchange = function(req, res, next) {
  res.locals.menu_exchange = "active";
  return res.render("exchange");
};

exports.exchange_type = function(req, res, next) {
  res.locals.menu_exchange = "active";
  console.log(req.params.type_id);
  return Lots.getLots(function(err, list) {
    return res.render("exchange-type", {
      list: list
    });
  });
};

exports.exchangelot = function(req, res, next) {
  var ep, id, re;
  res.locals.menu_exchange = "active";
  id = req.params.lots_id;
  re = new helper.recode();
  console.log(req.query);
  console.log(req.params);
  ep = new EventProxy.create("inte", "lots", function(inte, lots) {
    console.log(lots, inte);
    return Warehouse.getByUserId(res.locals.userid, id, function(err, ihas) {
      if (ihas != null) {
        re.reason = ihas._id;
        return res.send(re);
      } else {
        if ((lots != null) && inte >= lots.inte) {
          return Warehouse.getOne(lots._id, function(err, lot) {
            var used_at;
            if (lot != null) {
              lot.usedby = res.locals.userid;
              lot.used = true;
              used_at = new Date();
              lot.save();
              re.reason = lot._id;
              return Inte.newInte(res.locals.userid, -lots.inte, "兑换奖品:" + lot._id, function(err, int) {
                return res.send(re);
              });
            } else {
              re.recode = 201;
              re.reason = "此奖品已经被兑换光了,请等待补充.";
              return res.send(re);
            }
          });
        } else {
          re.recode = 201;
          re.reason = "积分不足,无法兑换.";
          return res.send(re);
        }
      }
    });
  });
  Lots.getById(id, function(err, lots) {
    return ep.emit("lots", lots);
  });
  return Inte.getInteAll(res.locals.userid, function(err, resutls) {
    return ep.emit("inte", resutls);
  });
};

exports.mylot = function(req, res, next) {
  var id;
  res.locals.menu_exchange = "active";
  id = req.params.lot_id;
  return Warehouse.getById(id, function(err, lot) {
    console.log(lot);
    if ((lot != null) && lot.usedby + "" === res.locals.userid) {
      return Lots.getById(lot.info, function(err, lotinfo) {
        return res.render("elot", {
          lot: lot,
          lotinfo: lotinfo
        });
      });
    } else {
      return res.render("elot", {
        lot: null
      });
    }
  });
};

exports.getlucky = function(req, res, next) {
  var re;
  re = new helper.recode();
  return Inte.getInteAll(res.locals.userid, function(err, resutls) {
    if (resutls >= 50) {
      return Inte.newInte(res.locals.userid, -50, "抽奖", function(err, int) {
        return res.send(re);
      });
    } else {
      re.recode = 201;
      re.reason = "积分不足";
      return res.send(re);
    }
  });
};

exports.nickname = function(req, res, next) {
  return res.render("nickname");
};

exports.postnickname = function(req, res, next) {
  var nickname, re;
  nickname = req.body.nickname;
  re = new helper.recode();
  console.log("nickname:", nickname, res.locals.userid);
  if (nickname != null) {
    return User.getUserById(res.locals.userid, function(err, user) {
      console.log(user);
      if (user != null) {
        user.nickname = nickname;
        user.save();
        return res.send(re);
      } else {
        re.recode = 201;
        re.reason = "还没有登录";
        return res.send(re);
      }
    });
  } else {
    re.recode = 201;
    re.reason = "昵称不能为空";
    return res.send(re);
  }
};

exports.topic = function(req, res, next) {
  return User.getUserById(res.locals.userid, function(err, user) {
    console.log(user);
    if ((user != null) && (user.nickname != null)) {
      return Topic.getOne(function(err, topic) {
        if (topic != null) {
          return Comment.getByTopic(topic._id, function(err, comments) {
            res.render("topic", {
              topic: topic,
              comments: comments
            });
            topic.view += 1;
            return topic.save();
          });
        } else {
          return res.render("topic", {
            topic: null
          });
        }
      });
    } else {
      return res.redirect("/nickname");
    }
  });
};

exports.comment = function(req, res, next) {
  var content, re;
  content = req.body.comment;
  re = new helper.recode();
  if ((content == null) || content === "") {
    re.recode = 201;
    re.reason = "评论内容不能为空";
    return res.send(re);
  }
  return Topic.getOne(function(err, topic) {
    if (topic != null) {
      return User.getUserById(res.locals.userid, function(err, user) {
        var name, reg;
        if (user != null) {
          reg = /(\d{3})\d{4}(\d{4})/;
          name = user.nickname;
          return Comment.newComment(user._id, topic._id, name, content, function(err, comment) {
            if (comment != null) {
              return res.send(re);
            } else {
              re.recode = 201;
              re.reason = "评论失败,请重试";
              return res.send(re);
            }
          });
        } else {
          re.recode = 201;
          re.reason = "还没登陆,无法评论";
          return res.send(re);
        }
      });
    }
  });
};

exports.comments = function(req, res, next) {
  var re, startime;
  re = new helper.recode();
  re.comments = [];
  startime = req.query.startime;
  if (startime != null) {
    startime = new Date(parseInt(startime));
  } else {
    startime = new Date();
  }
  return Topic.getOne(function(err, topic) {
    if (topic != null) {
      return Comment.getByTopic(topic._id, function(err, comments) {
        re.comments = comments;
        return res.send(re);
      });
    } else {
      return res.send(re);
    }
  });
};

exports.lucky = function(req, res, next) {
  res.locals.menu_lucky = "active";
  return res.render("lucky");
};

exports.art = function(req, res, next) {
  var art;
  art = "active-" + req.params.art_id;
  return res.render("art", {
    art: art
  });
};

exports.active = function(req, res, next) {
  return res.render("active-" + req.params.ac_id);
};

exports.page1 = function(req, res, next) {
  return res.render("page1");
};

exports.page2 = function(req, res, next) {
  return res.render("page2");
};

exports.page3 = function(req, res, next) {
  return res.render("page3");
};

exports.page4 = function(req, res, next) {
  return res.render("page4");
};

exports.page5 = function(req, res, next) {
  return res.render("page5");
};

exports.page6 = function(req, res, next) {
  return res.render("page6");
};

exports.page7 = function(req, res, next) {
  return res.render("page7");
};

setDefaultTopic = function() {
  var description, endtime, list, lot, name, startime;
  list = ["最让你遗憾的事", "最让你遗憾的事", "最让你遗憾的事", "最让你遗憾的事", "最让你遗憾的事"];
  name = list[Math.ceil(Math.random() * 4)];
  description = "简介";
  lot = "UME电影票2张";
  startime = new Date();
  endtime = new Date(new Date().getTime() + 1000 * 60 * 60 * 2);
  return Topic.getOne(function(err, t) {
    if (t == null) {
      return Topic.newTopic(name, description, lot, startime, endtime, function(err, topic) {
        return console.log("初始化了一个话题");
      });
    }
  });
};

setsomeDefautleLots = function() {
  return Lots.getLots(function(err, list) {
    var description, descriptionimg, headerimg, img, info_a, info_b, info_c, inte, name, order;
    if ((list != null) && list.length > 0) {

    } else {
      console.log("初始化了一些奖品");
      name = "神偷奶爸：小黄人快跑";
      description = "既搞笑又有趣的跑酷游戏";
      img = "/img/game-1.png";
      info_a = "版本：2.4.0 大小:47.68MB<br/>  2014年5月31日 <br/>适合所有年龄段人士";
      info_b = "兑换说明：进入游戏主页，点击设置按钮（右上角），输入兑换码<br/>注：此礼包仅可使用于三星专版游戏中";
      info_c = "游戏介绍：<p>在《神偷奶爸》官方游戏中，格鲁忠诚的小黄人已经准备好迎接艰难的挑战啦。扮演小黄人，在搞笑的快节奏挑战中与他人竞争，打败你的老板——超级大反派格鲁！跳跃、飞翔、躲避障碍、收集香蕉、恶作剧，打败其他反派，赢取“年度小黄人”的称号！</p><p>游戏亮点：</p><p>1.重新发现《神偷奶爸》的幸福和幽默。</p><p>2.跑过又去的标志性场所：格鲁的实验室和格鲁的住宅区。</p><p>3.在上百个任务中完成卑鄙动作。</p><p>4.用独一无二的服装、武器和道具自定义你的小黄人。</p><p>5.在多动态摄影视角下游戏。</p><h2>新业务推荐</h2><p>1.加入新地图-市中心</p><p>2.增加套装升级功能</p><p>3.新增3个套装：女仆，高尔夫球手和变装达人</p><p>4.新增任务页面提示</p><p>5.修改菜单名称</p><p>6.更换新icon</p>";
      headerimg = "/img/game-1-title.jpg";
      descriptionimg = "/img/game-1-decription.jpg";
      order = 1;
      inte = 15;
      Lots.newlots(name, description, img, order, inte, info_a, info_b, info_c, headerimg, descriptionimg, function(err, lots) {
        if (lots != null) {
          Warehouse.newlot(lots._id, "game-1-1", function(err, lot) {});
          Warehouse.newlot(lots._id, "game-1-2", function(err, lot) {});
          Warehouse.newlot(lots._id, "game-1-3", function(err, lot) {});
          return Warehouse.newlot(lots._id, "game-1-4", function(err, lot) {});
        }
      });
      name = "武侠Q传";
      description = "体验\"拳拳到肉\"的真实打斗快感";
      img = "/img/game-2.png";
      info_a = "版本：3.0.0.4.0  大小:107.01MB<br/>2014年7月10日<br/>适合12+年龄段人士";
      info_b = "兑换说明：进入游戏主页，点击设置按钮（右上角），输入兑换码<br/>注：此礼包仅可使用于三星专版游戏中";
      info_c = "<p>《武侠Q传•风云再起》全新资料片火爆开启，逆天内容震撼登场！ 全新3D卡牌！萌系Q版人物，新颖的玩法吸引了无数的武侠小说玩家入住到这个风起云涌变幻莫测的武侠世界中，全新逆天版本“风云再起”全新剧情、新玩法、新弟子、新装备，即将引起另一场江湖的腥风血雨。新资料片特色：【风云再起 多人组队共闯天下会】《武侠Q传•风云再起》全新资料片来袭,“天下会”高手如云，大敌当前兄弟齐上阵，玩家可与其他好友弟子一起共创天下会，好友之间共闯还会获得义气加成噢！【风云再起 全新属性助力战斗】《武侠Q传•风云再起》全新资料加入了种类丰富是全新特殊属性，弟子修炼可获得连击、吸血、斩杀等多样新属性，让游戏的战斗过程更具悬念。想要颠覆战斗、劣势翻盘？各位高玩平时多攒攒自己的人品，保证战斗可以多多触发特殊属性吧。【风云再起 装备阵法全新登场】《武侠Q转•风云再起》当然也会有绝世神兵的出现，神兵利器、古代阵法重现江湖，新装备于阵法将拥有特殊属性，通过合理的搭配与结合，使玩家弟子获得更强劲效果。拥有传说中的神兵利器，神秘的江湖阵法，一统江湖指日可待。【风云再起 全新弟子震撼登场】《武侠Q传•风云再起》中高手如云，隐藏着许多带有传奇色彩的人物，此次在“风云再起”新资料片中更增添了风神、死神、霸主等传奇人物，江湖唾手可得！【风云再起 小伙伴火力全开】新版本“风云再起”把小伙伴的天权位、天玑位、等火力全开，可刷出前所未有的十大属性同时还会激活缘分，享受前所有的效果噢，更强大的小伙伴尽在《武侠Q传•风云再起》。</p>";
      headerimg = "/img/game-2-title.jpg";
      descriptionimg = "/img/game-2-decription.jpg";
      order = 2;
      inte = 15;
      Lots.newlots(name, description, img, order, inte, info_a, info_b, info_c, headerimg, descriptionimg, function(err, lots) {
        if (lots != null) {
          Warehouse.newlot(lots._id, "game-2-1", function(err, lot) {});
          Warehouse.newlot(lots._id, "game-2-2", function(err, lot) {});
          Warehouse.newlot(lots._id, "game-2-3", function(err, lot) {});
          return Warehouse.newlot(lots._id, "game-2-4", function(err, lot) {});
        }
      });
      name = "封神英雄榜";
      description = "可体验如梦似幻的游戏乐趣";
      img = "/img/game-3.png";
      info_a = "版本：1.1.0 大小:92.95MB <br/>2014年7月10日 <br/>适合所有年龄段人士";
      info_b = "兑换说明：进入游戏主页，点击设置按钮（右上角），输入兑换码<br/>注：此礼包仅可使用于三星专版游戏中";
      info_c = "<p>在《封神英雄榜》是热播神话古装电视剧正版授权的同名手游，游戏创新地将策略、RPG与卡牌元素完美融合，独特的阵营战以及法宝对战系统，让玩家们感受最新颖的卡牌玩法。《封神英雄榜》采用Q版画风，游戏画面整体俏皮可爱，电视剧角色均以卡通形象在游戏中登场，经典台词在游戏中一一重现，中国风的仙界场景美轮美奂，进行游戏的同时，仿佛置身于仙境之中。传奇的神话战斗，海量神将任你差遣，进入《封神英雄榜》便可体验如梦似幻的游戏乐趣。</p><p>【正版授权 封神故事经典延续】 </p><p>原剧角色Q版形象植入，经典台词一一还原，感受掌中神话大剧<p>【仙家法器海量法宝各显神通】</p><p>神话经典法宝乱入，属性培养，技能强化，海量法宝无穷变化</p><p>【阵营对抗 大型战场公平竞技】 </p><p>首创卡牌阵营战，商周两大势力对抗，首创天枰平衡系统，打响卡牌阵营掠夺战役</p><p>【神魔齐聚 各路大咖同场乱斗】 </p><p>不只有封神，西游记、八仙过海乱入，体验最全神话故事</p><p>【策略卡牌收集养成指挥模拟】</p><p>卡片练功、卡片进化、排兵布阵，瞬息万变左右战局</p>";
      headerimg = "/img/game-3-title.jpg";
      descriptionimg = "/img/game-3-decription.jpg";
      order = 3;
      inte = 15;
      Lots.newlots(name, description, img, order, inte, info_a, info_b, info_c, headerimg, descriptionimg, function(err, lots) {
        if (lots != null) {
          Warehouse.newlot(lots._id, "game-3-1", function(err, lot) {});
          Warehouse.newlot(lots._id, "game-3-2", function(err, lot) {});
          Warehouse.newlot(lots._id, "game-3-3", function(err, lot) {});
          return Warehouse.newlot(lots._id, "game-3-4", function(err, lot) {});
        }
      });
      name = "超级英雄";
      description = "国内首款冒险卡牌手游";
      img = "/img/game-4.png";
      info_a = "版本：1.1.6  大小:95.51MB<br/>2014年7月10日<br/>适合所有年龄段人士";
      info_b = "兑换说明：进入游戏主页，点击设置按钮（右上角），输入兑换码<br/>注：此礼包仅可使用于三星专版游戏中";
      info_c = "<p><img src='/img/game-4-info.jpg' /></p>";
      headerimg = "/img/game-4-title.jpg";
      descriptionimg = "/img/game-4-decription.jpg";
      order = 4;
      inte = 15;
      return Lots.newlots(name, description, img, order, inte, info_a, info_b, info_c, headerimg, descriptionimg, function(err, lots) {
        if (lots != null) {
          Warehouse.newlot(lots._id, "game-4-1", function(err, lot) {});
          Warehouse.newlot(lots._id, "game-4-2", function(err, lot) {});
          Warehouse.newlot(lots._id, "game-4-3", function(err, lot) {});
          return Warehouse.newlot(lots._id, "game-4-4", function(err, lot) {});
        }
      });
    }
  });
};
