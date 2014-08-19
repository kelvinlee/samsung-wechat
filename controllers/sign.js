// Generated by CoffeeScript 1.7.1
var Authorize_Url, Comment, EventProxy, Inte, Lots, Noconcern, Topic, TopicLot, User, Warehouse, config, crypto, fs, helper, https, path, plugs, regs, setDefaultTopic, setDefaultWinner, setsomeDefautleLots, tointe, url;

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

TopicLot = require('../model/mongo').TopicLot;

Authorize_Url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + config.APPID + "&redirect_uri={url}&response_type=code&scope=snsapi_userinfo&state={state}#wechat_redirect";

Noconcern = "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200560267&idx=1&sn=ff18fdd9bbf0efe2dde9ccc8d3028fb4#rd";

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
  if ((req.cookies.userid != null) && req.cookies.userid !== "undefined" && req.cookies.userid !== "") {
    return next();
  } else {
    return res.redirect(Noconcern);
  }
};

exports.middle = function(req, res, next) {
  var openid;
  openid = req.params.openid;
  url = req.query.url;
  return User.getUserOpenId(openid, function(err, user) {
    console.log("openid:", openid, err, user);
    if (user != null) {
      res.cookie("userid", user._id);
      res.cookie("openid", openid);
      console.log({
        "has": true,
        user: user,
        cookie: req.cookies.userid
      });
      return res.redirect(url);
    } else {
      return User.regbyOpenId(openid, function(err, user) {
        console.log(err, user);
        res.cookie("userid", user._id);
        res.cookie("openid", openid);
        return Inte.newInte(user._id, 100, "初次注册赠送积分活动,100积分", function(err, inte) {
          console.log({
            "has": false,
            user: user,
            cookie: req.cookies.userid
          });
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
  if (req.cookies.userid == null) {
    re.recode = 201;
    re.reason = "请先登录.";
    res.send(re);
    return "";
  }
  return Inte.today(req.cookies.userid, function(err, today) {
    console.log("签到:" + today);
    if ((today != null) && today.length !== 0) {
      re.recode = 201;
      re.reason = "今天已经签到过了.";
      return res.send(re);
    } else {
      return Inte.newInte(req.cookies.userid, 20, "regs", function(err, resutls) {
        console.log("签到成功:", resutls);
        return res.send(re);
      });
    }
  });
};

exports.tointe = tointe;

exports.my = function(req, res, next) {
  var ep;
  res.locals.menu_my = "active";
  console.log("userid:", req.cookies.userid);
  ep = new EventProxy.create("user", "inte", "today", function(user, inte, today) {
    var count;
    count = inte;
    return res.render("my", {
      user: user,
      inte: count,
      today: today
    });
  });
  Inte.today(req.cookies.userid, function(err, resutls) {
    return ep.emit("today", resutls);
  });
  User.getUserById(req.cookies.userid, function(err, resutls) {
    return ep.emit("user", resutls);
  });
  return Inte.getInteAll(req.cookies.userid, function(err, resutls) {
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
    return Warehouse.getByUserId(req.cookies.userid, id, function(err, ihas) {
      if (ihas != null) {
        re.reason = ihas._id;
        return res.send(re);
      } else {
        if (lots != null) {
          return Warehouse.getOne(lots._id, function(err, lot) {
            var used_at;
            if (lot != null) {
              lot.usedby = req.cookies.userid;
              lot.used = true;
              used_at = new Date();
              lot.save();
              re.reason = lot._id;
              return Inte.newInte(req.cookies.userid, -lots.inte, "兑换奖品:" + lot._id, function(err, int) {
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
          re.reason = "此奖品已经被兑换光了,请等待补充.";
          return res.send(re);
        }
      }
    });
  });
  Lots.getById(id, function(err, lots) {
    return ep.emit("lots", lots);
  });
  return Inte.getInteAll(req.cookies.userid, function(err, resutls) {
    return ep.emit("inte", resutls);
  });
};

exports.mylot = function(req, res, next) {
  var id;
  res.locals.menu_exchange = "active";
  id = req.params.lot_id;
  return Warehouse.getById(id, function(err, lot) {
    console.log(lot);
    if ((lot != null) && lot.usedby + "" === req.cookies.userid) {
      return Lots.getById(lot.info, function(err, lotinfo) {
        return res.render("elot", {
          lot: lot,
          lotinfo: lotinfo
        });
      });
    } else {
      return res.redirect("/sign/exchange/1");
    }
  });
};

exports.luckyframe = function(req, res, next) {
  return res.render("luckyframe");
};

exports.getlucky = function(req, res, next) {
  var re;
  re = new helper.recode();
  re.url = "";
  return Inte.getInteAll(req.cookies.userid, function(err, resutls) {
    if (resutls >= 50) {
      return Inte.newInte(req.cookies.userid, -50, "抽奖", function(err, int) {
        var list, lot, none;
        list = [[14, 14, 14], [14, 14, 12], [14, 12, 12], [15, 15, 15], [13, 13, 13], [12, 12, 11], [11, 11, 11]];
        lot = Math.round(Math.random() * 20000);
        console.log(lot);
        if (lot === 8) {
          console.log("平板");
          return Warehouse.getWinnerByInfo("Tabs", function(err, lots) {
            var none;
            if (lots != null) {
              lots.usedby = req.cookies.userid;
              lots.used = true;
              lots.save();
              re.url = "/sign/winner/" + lots._id;
              re.reason = list[0];
              re.reason = re.reason.join(",");
              return res.send(re);
            } else {
              none = [[13, 12, 13], [11, 13, 15], [13, 15, 11]];
              re.reason = none[Math.ceil(Math.random() * (none.length - 1))];
              re.reason = re.reason.join(",");
              return res.send(re);
            }
          });
        }
        if (lot >= 1 && lot <= 10 && lot !== 8) {
          console.log("耳机");
          return Warehouse.getWinnerByInfo("Headset", function(err, lots) {
            var none;
            if (typeof lost !== "undefined" && lost !== null) {
              lots.usedby = req.cookies.userid;
              lots.used = true;
              lots.save();
              re.url = "/sign/winner/" + lots._id;
              re.reason = list[1];
              re.reason = re.reason.join(",");
              return res.send(re);
            } else {
              none = [[13, 12, 13], [11, 13, 15], [13, 15, 11]];
              re.reason = none[Math.ceil(Math.random() * (none.length - 1))];
              re.reason = re.reason.join(",");
              return res.send(re);
            }
          });
        }
        if (lot >= 11 && lot <= 20) {
          console.log("移动电源");
          return Warehouse.getWinnerByInfo("Power", function(err, lots) {
            var none;
            if (lots != null) {
              lots.usedby = req.cookies.userid;
              lots.used = true;
              lots.save();
              re.url = "/sign/winner/" + lots._id;
              re.reason = list[2];
              re.reason = re.reason.join(",");
              return res.send(re);
            } else {
              none = [[13, 12, 13], [11, 13, 15], [13, 15, 11]];
              re.reason = none[Math.ceil(Math.random() * (none.length - 1))];
              re.reason = re.reason.join(",");
              return res.send(re);
            }
          });
        }
        if (lot >= 150 && lot <= 300) {
          console.log("搜狐公仔");
          return Warehouse.getWinnerByInfo("sohugz", function(err, lots) {
            var none;
            if (lots != null) {
              lots.usedby = req.cookies.userid;
              lots.used = true;
              lots.save();
              re.url = "/sign/winner/" + lots._id;
              re.reason = list[4];
              re.reason = re.reason.join(",");
              return res.send(re);
            } else {
              none = [[13, 12, 13], [11, 13, 15], [13, 15, 11]];
              re.reason = none[Math.ceil(Math.random() * (none.length - 1))];
              re.reason = re.reason.join(",");
              return res.send(re);
            }
          });
        }
        if (lot >= 1500 && lot <= 3000) {
          return Inte.getInteByUid(300, req.cookies.userid, function(err, inte) {
            var none;
            if (inte.length >= 3) {
              none = [[13, 12, 13], [11, 13, 15], [13, 15, 11]];
              re.reason = none[Math.ceil(Math.random() * (none.length - 1))];
              re.reason = re.reason.join(",");
              return res.send(re);
            }
            return Inte.getInteAction("抽奖获得,300积分", function(err, resutls) {
              if (resutls < 500) {
                if (req.cookies.userid != null) {
                  Inte.newInte(req.cookies.userid, 300, "抽奖获得,300积分", function(err, inte) {});
                }
                re.url = "/sign/winner/300";
                re.reason = list[3];
                re.reason = re.reason.join(",");
                return res.send(re);
              } else {
                none = [[13, 12, 13], [11, 13, 15], [13, 15, 11]];
                re.reason = none[Math.ceil(Math.random() * (none.length - 1))];
                re.reason = re.reason.join(",");
                return res.send(re);
              }
            });
          });
        }
        if (lot >= 4000 && lot <= 14000) {
          return Warehouse.getWinnerByLotAndUid("六等奖", req.cookies.userid, function(err, resutls) {
            var none;
            if ((resutls != null) && resutls.length > 0) {
              console.log("已经中过六等奖.");
              none = [[13, 12, 13], [11, 13, 15], [13, 15, 11]];
              re.reason = none[Math.ceil(Math.random() * (none.length - 1))];
              re.reason = re.reason.join(",");
              return res.send(re);
            } else {
              return Warehouse.newwinner("hg", "六等奖", "none", function(err, win) {
                win.used = true;
                win.usedby = req.cookies.userid;
                win.save();
                re.url = "/sign/winner/hg";
                re.reason = list[6];
                re.reason = re.reason.join(",");
                return res.send(re);
              });
            }
          });
        }
        if (re.reason === "success") {
          console.log("没有抽中");
          none = [[13, 12, 13], [11, 13, 15], [13, 15, 11]];
          re.reason = none[Math.ceil(Math.random() * (none.length - 1))];
          re.reason = re.reason.join(",");
          return res.send(re);
        }
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
  console.log("nickname:", nickname, req.cookies.userid);
  if (nickname.toLowerCase() === "三星乐园" || nickname.toLowerCase() === "samsung" || nickname.toLowerCase() === "samsungapps") {
    re.recode = 201;
    re.reason = "昵称已经存在,再试试其他的名称.";
    return res.send(re);
  }
  if (nickname.length > 16 || nickname.length < 3) {
    re.recode = 201;
    re.reason = "昵称只能在3~16个字符之间.";
    return res.send(re);
  }
  if (nickname != null) {
    return User.findByNickname(nickname, function(err, user) {
      console.log("nickname:", err, user);
      if (user != null) {
        re.recode = 201;
        re.reason = "昵称已经存在,再试试其他的名称.";
        return res.send(re);
      }
      return User.getUserById(req.cookies.userid, function(err, user) {
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
    });
  } else {
    re.recode = 201;
    re.reason = "昵称不能为空";
    return res.send(re);
  }
};

exports.topic = function(req, res, next) {
  console.log("topic:", req.cookies.openid);
  if (req.cookies.openid != null) {
    return User.getUserOpenId(req.cookies.openid, function(err, user) {
      console.log(user);
      if ((user != null) && (user.nickname != null)) {
        return Topic.getOne(function(err, topic) {
          console.log("topic:" + topic);
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
  } else {
    return res.redirect(Noconcern);
  }
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
      return User.getUserOpenId(req.cookies.openid, function(err, user) {
        var name, reg;
        console.log("话题评论:", err, user, req.cookies.openid);
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
  return Warehouse.getWinnerByUid(req.cookies.userid, function(err, resutls) {
    return res.render("lucky", {
      luckylist: resutls
    });
  });
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

exports.topic_lot_list = function(req, res, next) {
  return TopicLot.getTopiclot(req.cookies.userid, function(err, resutls) {
    console.log(req.cookies.userid, resutls);
    return res.render("topic-list", {
      list: resutls
    });
  });
};

exports.topic_lot = function(req, res, next) {
  var id;
  id = req.params.id;
  return TopicLot.getId(id, function(err, resutls) {
    return res.render("tlots", {
      winner: resutls
    });
  });
};

exports.topic_lot_post = function(req, res, next) {
  var adr, check, id, mobile, re, username;
  id = req.params.id;
  username = req.body.username;
  mobile = req.body.mobile;
  adr = req.body.adr;
  re = new helper.recode();
  if ((username == null) || username === "") {
    re.recode = 201;
    re.reason = "姓名不能为空";
  }
  if ((mobile == null) || mobile === "") {
    re.recode = 201;
    re.reason = "手机号码不能为空";
  }
  check = /^[1][3-8]\d{9}$/;
  if (!check.test(mobile)) {
    re.recode = 201;
    re.reason = "请验证手机号码格式";
  }
  if ((adr == null) || adr === "") {
    re.recode = 201;
    re.reason = "请输入邮寄地址";
  }
  if (re.recode !== 200) {
    return res.send(re);
  }
  return TopicLot.getId(id, function(err, resutls) {
    if ((resutls != null) && resutls.used) {
      re.recode = 201;
      re.reason = "此奖品已经兑换过了";
      return res.send(re);
    } else if ((resutls != null) && resutls.uid + "" === req.cookies.userid) {
      resutls.used = true;
      resutls.username = username;
      resutls.mobile = mobile;
      resutls.adr = adr;
      resutls.save();
      return res.send(re);
    } else {
      re.recode = 201;
      re.reason = "您不是此奖品的获得人.";
      return res.send(re);
    }
  });
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

exports.page8 = function(req, res, next) {
  return res.render("page8");
};

exports.game = function(req, res, next) {
  return res.render("gamedown");
};

exports.lots = function(req, res, next) {
  return res.render("lots");
};

exports.winner = function(req, res, next) {
  var id;
  res.locals.menu_lucky = "active";
  id = req.params.winner_id;
  if (id === "dp") {
    return res.render("lots-dp");
  }
  if (id === "hg") {
    return res.render("lots-hg");
  }
  if (id === "300") {
    return res.render("lots-300");
  }
  return Warehouse.getWinnerById(id, function(err, win) {
    if (win != null) {
      return res.render("lots", {
        win: win
      });
    }
  });
};

exports.winner_post = function(req, res, next) {
  var adr, check, mobile, re, username;
  re = new helper.recode();
  username = req.body.username;
  mobile = req.body.mobile;
  adr = req.body.adr;
  if ((username == null) || username === "") {
    re.recode = 201;
    re.reason = "用户名不能为空";
    return res.send(re);
  }
  check = /^[1][3-8]\d{9}$/;
  if (!check.test(mobile)) {
    re.recode = 201;
    re.reason = "请验证手机号码格式";
    return res.send(re);
  }
  if ((adr == null) || adr === "") {
    re.recode = 201;
    re.reason = "邮寄地址不能为空";
    return res.send(re);
  }
  return Warehouse.getWinnerByUandW(req.cookies.userid, req.params.winner_id, function(err, win) {
    if ((win != null) && (win.username != null)) {
      re.recode = 201;
      re.reason = "您已经提交过此中奖信息,无法更改.";
      return res.send(re);
    }
    if (win != null) {
      win.username = username;
      win.mobile = mobile;
      win.adr = adr;
      win.create_at = new Date();
      win.save();
      return res.send(re);
    } else {
      re.recode = 201;
      re.reason = "请不要使用其他用户的兑奖码";
      return res.send(re);
    }
  });
};

exports.share = function(req, res, next) {
  var info;
  info = req.params.info;
  return res.render("share", {
    info: info
  });
};

setDefaultTopic = function() {
  var description, endtime, list, lot, name, startime;
  list = ["你敢不敢说走就走", "你敢不敢说走就走", "你敢不敢说走就走", "你敢不敢说走就走", "你敢不敢说走就走"];
  name = list[Math.ceil(Math.random() * 4)];
  description = "你敢不敢说走就走，去那向往的远方，你犹豫着不走，到底是为何？每次旅行都遗憾放弃，到底是什么令你迟迟不走？快来说说牵绊你脚步的那些事儿吧~";
  lot = "迪士尼玩偶";
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

setDefaultWinner = function() {
  var i, _i, _j, _k, _l, _results;
  for (i = _i = 0; _i < 1; i = ++_i) {
    Warehouse.newwinner("Tabs", "一等奖", "lots-1.jpg", function(err, win) {});
  }
  for (i = _j = 0; _j < 3; i = ++_j) {
    Warehouse.newwinner("Headset", "二等奖", "lots-2.jpg", function(err, win) {});
  }
  for (i = _k = 0; _k < 5; i = ++_k) {
    Warehouse.newwinner("Power", "三等奖", "lots-3.jpg", function(err, win) {});
  }
  _results = [];
  for (i = _l = 0; _l < 300; i = ++_l) {
    _results.push(Warehouse.newwinner("sohugz", "四等奖", "lots-4.jpg", function(err, win) {}));
  }
  return _results;
};

setsomeDefautleLots = function() {
  Warehouse.counts(function(err, couts) {
    if (couts <= 0) {
      console.log("初始化了一些手气奖品");
      return setDefaultWinner();
    }
  });
  return Lots.getLots(function(err, list) {
    var description, descriptionimg, headerimg, img, info_a, info_b, info_c, inte, name, order;
    if ((list != null) && list.length > 0) {

    } else {
      console.log("初始化了一些游戏奖品");
      setDefaultWinner();
      name = "神偷奶爸：小黄人快跑";
      description = "小黄人快跑！一路搞笑逗趣停不住！";
      img = "/img/game-1.jpg";
      info_a = "版本：2.4.0 大小:47.68MB<br/>  2014年5月31日 <br/>适合所有年龄段人士";
      info_b = "兑换说明：进入游戏主页，点击设置按钮（右上角），输入兑换码<br/>注：此礼包仅可使用于三星专版游戏中";
      info_c = "游戏介绍：<p>在《神偷奶爸》官方游戏中，格鲁忠诚的小黄人已经准备好迎接艰难的挑战啦。扮演小黄人，在搞笑的快节奏挑战中与他人竞争，打败你的老板——超级大反派格鲁！跳跃、飞翔、躲避障碍、收集香蕉、恶作剧，打败其他反派，赢取“年度小黄人”的称号！</p><p>游戏亮点：</p><p>1.重新发现《神偷奶爸》的幸福和幽默。</p><p>2.跑过又去的标志性场所：格鲁的实验室和格鲁的住宅区。</p><p>3.在上百个任务中完成卑鄙动作。</p><p>4.用独一无二的服装、武器和道具自定义你的小黄人。</p><p>5.在多动态摄影视角下游戏。</p><h2>新业务推荐</h2><p>1.加入新地图-市中心</p><p>2.增加套装升级功能</p><p>3.新增3个套装：女仆，高尔夫球手和变装达人</p><p>4.新增任务页面提示</p><p>5.修改菜单名称</p><p>6.更换新icon</p>";
      headerimg = "/img/game-1-title.jpg";
      descriptionimg = "/img/game-1-description.jpg";
      order = 1;
      inte = 0;
      Lots.newlots(name, description, img, order, inte, info_a, info_b, info_c, headerimg, descriptionimg, function(err, lots) {});
      name = "武侠Q传";
      description = "拳拳到肉，亲眼见证！体验真实打斗的畅快感受~";
      img = "/img/game-2.jpg";
      info_a = "版本：3.0.0.4.0  大小:107.01MB<br/>2014年7月10日<br/>适合12+年龄段人士";
      info_b = "兑换说明：进入游戏主页，点击设置按钮（右上角），输入兑换码<br/>注：此礼包仅可使用于三星专版游戏中";
      info_c = "<p>《武侠Q传•风云再起》全新资料片火爆开启，逆天内容震撼登场！ 全新3D卡牌！萌系Q版人物，新颖的玩法吸引了无数的武侠小说玩家入住到这个风起云涌变幻莫测的武侠世界中，全新逆天版本“风云再起”全新剧情、新玩法、新弟子、新装备，即将引起另一场江湖的腥风血雨。新资料片特色：【风云再起 多人组队共闯天下会】《武侠Q传•风云再起》全新资料片来袭,“天下会”高手如云，大敌当前兄弟齐上阵，玩家可与其他好友弟子一起共创天下会，好友之间共闯还会获得义气加成噢！【风云再起 全新属性助力战斗】《武侠Q传•风云再起》全新资料加入了种类丰富是全新特殊属性，弟子修炼可获得连击、吸血、斩杀等多样新属性，让游戏的战斗过程更具悬念。想要颠覆战斗、劣势翻盘？各位高玩平时多攒攒自己的人品，保证战斗可以多多触发特殊属性吧。【风云再起 装备阵法全新登场】《武侠Q转•风云再起》当然也会有绝世神兵的出现，神兵利器、古代阵法重现江湖，新装备于阵法将拥有特殊属性，通过合理的搭配与结合，使玩家弟子获得更强劲效果。拥有传说中的神兵利器，神秘的江湖阵法，一统江湖指日可待。【风云再起 全新弟子震撼登场】《武侠Q传•风云再起》中高手如云，隐藏着许多带有传奇色彩的人物，此次在“风云再起”新资料片中更增添了风神、死神、霸主等传奇人物，江湖唾手可得！【风云再起 小伙伴火力全开】新版本“风云再起”把小伙伴的天权位、天玑位、等火力全开，可刷出前所未有的十大属性同时还会激活缘分，享受前所有的效果噢，更强大的小伙伴尽在《武侠Q传•风云再起》。</p>";
      headerimg = "/img/game-2-title.jpg";
      descriptionimg = "/img/game-2-decription.jpg";
      order = 2;
      inte = 0;
      Lots.newlots(name, description, img, order, inte, info_a, info_b, info_c, headerimg, descriptionimg, function(err, lots) {});
      name = "超级英雄";
      description = "最强英雄，华丽上阵！史上最强英雄穿越来袭~";
      img = "/img/game-4.jpg";
      info_a = "版本：1.1.6  大小:95.51MB<br/>2014年7月10日<br/>适合所有年龄段人士";
      info_b = "兑换说明：进入游戏主页，点击设置按钮（右上角），输入兑换码<br/>注：此礼包仅可使用于三星专版游戏中";
      info_c = "<p><img src='/img/game-4-info.jpg' /></p>";
      headerimg = "/img/game-4-title.jpg";
      descriptionimg = "/img/game-4-decription.jpg";
      order = 4;
      inte = 0;
      return Lots.newlots(name, description, img, order, inte, info_a, info_b, info_c, headerimg, descriptionimg, function(err, lots) {});
    }
  });
};
