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
        return res.redirect(url);
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
      return Inte.newInte(res.locals.userid, 20, "签到", function(err, resutls) {
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
    return Warehouse.getByUserId(res.locals.userid, function(err, ihas) {
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
    if ((lot != null) && lot.usedby + "" === res.locals.userid) {
      return res.render("elot", {
        lot: lot
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
  return res.send(re);
};

exports.nickname = function(req, res, next) {
  return res.render("nickname");
};

exports.postnickname = function(req, res, next) {
  var nickname, re;
  nickname = req.body.nickname;
  re = new helper.recode();
  console.log("nickname:", nickname);
  if (nickname != null) {
    return User.getUserOpenId(res.locals.openid, function(err, user) {
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
  return User.getUserOpenId(res.locals.openid, function(err, user) {
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
    var description, img, inte, name, order;
    if ((list != null) && list.length > 0) {

    } else {
      console.log("初始化了一些奖品");
      name = "神偷奶爸：小黄人快跑";
      description = "既搞笑又有趣的跑酷游戏";
      img = "/img/game-1.png";
      order = 1;
      inte = 15;
      Lots.newlots(name, description, img, order, inte, function(err, lots) {
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
      order = 2;
      inte = 15;
      Lots.newlots(name, description, img, order, inte, function(err, lots) {
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
      order = 3;
      inte = 15;
      Lots.newlots(name, description, img, order, inte, function(err, lots) {
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
      order = 4;
      inte = 15;
      return Lots.newlots(name, description, img, order, inte, function(err, lots) {
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
