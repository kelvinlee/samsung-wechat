// Generated by CoffeeScript 1.7.1

/*
--------------------------------------------
     Begin wechat.coffee
--------------------------------------------
 */
var BufferHelper, Comment, EventProxy, Inte, Lots, Topic, User, Warehouse, checkMessage, checkSignature, clearQA, config, crypto, empty, formatMessage, fs, gamemenu, getMessage, getQA, jianxingpin, luckymenu, magazine, my, myProcess, newactive, overQA, oversite, path, plugs, plugs_menu, plugs_subscribe, regsinto, searchQA, topicmenu, welcometext, xml2js, _nr, _qa;

fs = require('fs');

path = require('path');

crypto = require('crypto');

xml2js = require('xml2js');

BufferHelper = require('bufferhelper');

EventProxy = require('eventproxy');

config = require('../config').config;

plugs = require('./wechat-plugs');

User = require('../model/mongo').User;

Inte = require('../model/mongo').Inte;

Lots = require('../model/mongo').Lots;

Warehouse = require('../model/mongo').Warehouse;

Topic = require('../model/mongo').Topic;

Comment = require('../model/mongo').Comment;

checkSignature = function(query, token) {
  var arr, nonce, shasum, signature, timestamp;
  signature = query.signature != null ? query.signature : '';
  timestamp = query.timestamp != null ? query.timestamp : '';
  nonce = query.nonce != null ? query.nonce : '';
  shasum = crypto.createHash('sha1');
  arr = [token, timestamp, nonce].sort();
  shasum.update(arr.join(''));
  return shasum.digest('hex') === signature;
};

getMessage = function(stream, callback) {
  var buf;
  buf = new BufferHelper();
  return buf.load(stream, function(err, buf) {
    var xml;
    if (err) {
      return callback(err);
    }
    xml = buf.toString('utf-8');
    return xml2js.parseString(xml, {
      trim: true
    }, callback);
  });
};

formatMessage = function(result) {
  var key, message, val;
  message = {};
  if (!result) {
    return false;
  }
  for (key in result.xml) {
    val = result.xml[key][0];
    message[key] = (val == null ? '' : val).trim();
  }
  return message;
};

checkMessage = function(message, callback) {
  var re;
  re = null;
  switch (message.MsgType) {
    case 'text':
      console.log('文字信息');
      return getQA(message.Content, message.FromUserName, callback);
    case 'image':
      console.log('图片信息');
      return callback(re);
    case 'voice':
      console.log('声音信息');
      return callback(re);
    case 'video':
      console.log('视频信息');
      return callback(re);
    case 'location':
      console.log('地理信息');
      return callback(re);
    case 'link':
      console.log('链接消息');
      return callback(re);
    case 'event':
      console.log('事件消息');
      console.log(message.Event);
      if (message.Event === 'subscribe') {
        return plugs_subscribe(message, callback);
      }
      if (message.Event === 'CLICK' || message.Event === 'VIEW') {
        return plugs_menu(message, callback);
      }
      return callback(re);
  }
  return callback(re);
};

exports.sendmenu = function(req, res, next) {
  plugs.sendMenus();
  return res.send("ok");
};

exports.index = function(req, res, next) {
  var ep, parse, to;
  parse = req.query;
  to = checkSignature(parse, config.wechat_token);
  ep = new EventProxy.create("message", "backMsg", function(message, backMsg) {
    console.log("run backMsg");
    if (backMsg != null) {
      switch (backMsg.type) {
        case 'text':
          if (backMsg.random != null) {
            backMsg.content = backMsg.random[Math.round(Math.random() * (backMsg.random.length - 1))];
          }
          return res.render('wechat/wechat-text', {
            toUser: message.FromUserName,
            fromUser: message.ToUserName,
            date: new Date().getTime(),
            content: backMsg.content
          });
        case 'news':
          return res.render('wechat/wechat-news', {
            toUser: message.FromUserName,
            fromUser: message.ToUserName,
            date: new Date().getTime(),
            items: backMsg.items
          });
        default:
          return res.render('wechat/wechat-text', {
            toUser: message.FromUserName,
            fromUser: message.ToUserName,
            date: new Date().getTime(),
            content: ""
          });
      }
    } else {
      return res.render('wechat/wechat-text', {
        toUser: message.FromUserName,
        fromUser: message.ToUserName,
        date: new Date().getTime(),
        content: ""
      });
    }
  });
  return getMessage(req, function(err, result) {
    var message;
    if (err) {
      console.log(err);
    }
    if (!result) {
      return res.send(to ? parse.echostr : "what?");
    }
    message = formatMessage(result);
    ep.emit('message', message);
    return checkMessage(message, function(back) {
      console.log("back To: ", back);
      return ep.emit('backMsg', back);
    });
  });
};


/*
--------------------------------------------
     Begin wechat-subscribe.coffee
--------------------------------------------
 */

welcometext = {
  name: "welcome",
  key: "你好",
  type: "text",
  content: "欢迎关注【三星乐园】官⽅微信。参与活动赢取Samsung GALAXY K zoom，还等什么？回复【1】了解活动详情。"
};

plugs_subscribe = function(message, callback) {
  return callback(welcometext);
};


/*
--------------------------------------------
     Begin wechat-menu.coffee
--------------------------------------------
 */

newactive = function() {
  return {
    name: "新活动",
    key: "1",
    type: "news",
    items: [
      {
        title: "关注三星乐园微信公众账号,惊喜大礼等你拿!",
        description: '关注三星乐园微信公众账号,惊喜大礼等你拿!',
        picurl: "" + config.host + "/img/banner-1.jpg",
        url: "" + config.host + "/page1"
      }, {
        title: "GALAXY K zoom让每个瞬间都精彩!",
        description: 'GALAXY K zoom让每个瞬间都精彩!',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzPrkjqVuXnZk7kv2dM1ed7uuJ11IicjPwfuicc6tmAVhrLyolJTe2oThaatNbInYZBdmBAlJMWfrZqw/0",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200501036&idx=1&sn=7c19d06ff08719359639336eb357bbfe#rd"
      }, {
        title: "参与今日话题#你敢不敢说走就走#赢取迪士尼小玩偶",
        description: '参与今日话题#你敢不敢说走就走#赢取迪士尼小玩偶',
        picurl: "" + config.host + "/img/banner-10.jpg",
        url: "" + config.host + "/middle/{openid}?url=/sign/topic"
      }
    ]
  };
};

oversite = function() {
  return {
    name: "临·现场",
    key: "1",
    type: "news",
    items: [
      {
        title: "重新定义“视”界 三星 GALAXY Tab S 开启色彩大门",
        description: '揭开万众期待的神秘面纱，三星 GALAXY Tab S为你开启全新的色彩大门',
        picurl: "" + config.host + "/img/banner-7.jpg",
        url: "" + config.host + "/art/6"
      }
    ]
  };
};

jianxingpin = function() {
  return {
    name: "鉴星品",
    key: "1",
    type: "news",
    items: [
      {
        title: "Samsung GALAXY Tab S Super AMOLED 炫丽屏重新定义视界",
        description: 'Samsung GALAXY Tab S Super AMOLED 炫丽屏重新定义视界',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzO0MI2JicM7fHVaiaQeTniaYBH9RQ1iaJH9XK6iatFxjdE8WQ8qFqEZ2MOz89T8ZcBBLJP9gIzH9pTbpeQ/0",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200559196&idx=1&sn=65df46c2bf8f852d815d3bb887c96ee2#rd"
      }, {
        title: "Super AMOLED 介绍",
        description: 'Super AMOLED 介绍',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzO0MI2JicM7fHVaiaQeTniaYBHRQObuicHPsbAsdZxcVuoqNiatI3jCoVOmiaqtYGV0ObgL4KESxVmnk6Qw/0",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200559196&idx=2&sn=e63c12ed63c62ade95295f7f04570a01#rd"
      }, {
        title: "Samsung GALAXY K zoom 让每个瞬间都精彩",
        description: 'Samsung GALAXY K zoom 让每个瞬间都精彩',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzO0MI2JicM7fHVaiaQeTniaYBH6fTuuEtLsy7fGvZsBflV9SOpY5iacHiaDd056ZA3aq8HGPxEzzpEq5aw/0",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200559196&idx=3&sn=a3cefce3da85b400072a9303de8be9e4#rd"
      }, {
        title: "Samsung GALAXY S5 专享4G应用",
        description: 'Samsung GALAXY S5 专享4G应用',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzO0MI2JicM7fHVaiaQeTniaYBHhMDv4OicBJTCVnhTfSa0g6UPAick0MFVfBr86PtDVe9akcS844s3YYJQ/0",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200559196&idx=4&sn=84820a9612c169b067729da25596adfe#rd"
      }
    ]
  };
};

magazine = function() {
  return {
    name: "看杂志",
    key: "1",
    type: "news",
    items: [
      {
        title: "新炫刊，汇聚海量精品杂志，畅爽的交互体验，带来全新视觉盛宴。",
        description: '新炫刊，汇聚海量精品杂志，畅爽的交互体验，带来全新视觉盛宴。',
        picurl: "" + config.host + "/img/banner-15.jpg",
        url: "" + config.host + "/art/15"
      }, {
        title: "华夏地理——多角度深度探索世界，为您带来世界变迁的精彩内容",
        description: '华夏地理——多角度深度探索世界，为您带来世界变迁的精彩内容',
        picurl: "" + config.host + "/img/banner-16.jpg",
        url: "" + config.host + "/art/16"
      }, {
        title: "新潮电子——领导数码时尚新生活",
        description: '新潮电子——领导数码时尚新生活',
        picurl: "" + config.host + "/img/banner-17.jpg",
        url: "" + config.host + "/art/17"
      }, {
        title: "时尚旅游——独特视角带你探索世界",
        description: '时尚旅游——独特视角带你探索世界',
        picurl: "" + config.host + "/img/banner-18.jpg",
        url: "" + config.host + "/art/18"
      }
    ]
  };
};

my = function() {
  return {
    name: "查积分",
    key: "1",
    type: "news",
    items: [
      {
        title: "积分信息查询",
        description: '您的积分是:{jf}积分,点击《阅读全文》查看详细信息. [请勿转发此条信息,包含您的个人信息]',
        picurl: "" + config.host + "/img/banner-into.jpg",
        url: "" + config.host + "/middle/{openid}?url=/sign/my"
      }
    ]
  };
};

regsinto = function() {
  return {
    name: "来签到",
    key: "1",
    type: "news",
    items: [
      {
        title: "签到获取更多积分",
        description: '您的积分是:{jf}积分,点击《阅读全文》查看详细信息. [请勿转发此条信息,包含您的个人信息]',
        picurl: "" + config.host + "/img/banner-qd.jpg",
        url: "" + config.host + "/middle/{openid}?url=/page7"
      }
    ]
  };
};

topicmenu = function() {
  return {
    name: "聊话题",
    key: "1",
    type: "news",
    items: [
      {
        title: "本期话题:最让你遗憾的事",
        description: '聊话题赢大奖. [请勿转发此条信息,包含您的个人信息]',
        picurl: "" + config.host + "/img/banner-topic.jpg",
        url: "" + config.host + "/middle/{openid}?url=/sign/topic"
      }
    ]
  };
};

luckymenu = function() {
  return {
    name: "试手气",
    key: "1",
    type: "news",
    items: [
      {
        title: "来试试看你的手气,赢大奖",
        description: '摇转轮盘赢大奖. [请勿转发此条信息,包含您的个人信息]',
        picurl: "" + config.host + "/img/banner-lucky.jpg",
        url: "" + config.host + "/middle/{openid}?url=/sign/lucky"
      }
    ]
  };
};

gamemenu = function() {
  return {
    name: "玩游戏",
    key: "1",
    type: "news",
    items: [
      {
        title: "玩热门网游，领豪华礼包！",
        description: '点击玩·游戏，下载玩网游，超级礼包等你来拿!',
        picurl: "" + config.host + "/img/banner-20.jpg",
        url: "" + config.host + "/middle/{openid}?url=/sign/exchange/1"
      }
    ]
  };
};

empty = {
  name: "返回收到图片信息.",
  key: "1",
  type: "text",
  backContent: ""
};

plugs_menu = function(message, callback) {
  var newmy;
  console.log(message);
  if (message.EventKey === "oversite") {
    return callback(new oversite());
  } else if (message.EventKey === "jianxingpin") {
    return callback(new jianxingpin());
  } else if (message.EventKey === "magazine") {
    return callback(new magazine());
  } else if (message.EventKey === "newactive") {
    return callback(new newactive());
  } else if (message.EventKey === "my") {
    newmy = new my();
    newmy.items[0].url = newmy.items[0].url.replace("{openid}", message.FromUserName);
    return User.getUserOpenId(message.FromUserName, function(err, user) {
      console.log(newmy.items[0].url);
      if (user != null) {
        return Inte.getInteAll(user._id, function(err, count) {
          newmy.items[0].description = newmy.items[0].description.replace("{jf}", count);
          return callback(newmy);
        });
      } else {
        newmy.items[0].description = newmy.items[0].description.replace("{jf}", "0");
        return callback(newmy);
      }
    });
  } else if (message.EventKey === "regsinto") {
    newmy = new regsinto();
    newmy.items[0].url = newmy.items[0].url.replace("{openid}", message.FromUserName);
    return User.getUserOpenId(message.FromUserName, function(err, user) {
      console.log(newmy.items[0].url);
      if (user != null) {
        return Inte.getInteAll(user._id, function(err, count) {
          newmy.items[0].description = newmy.items[0].description.replace("{jf}", count);
          return callback(newmy);
        });
      } else {
        newmy.items[0].description = newmy.items[0].description.replace("{jf}", "0");
        return callback(newmy);
      }
    });
  } else if (message.EventKey === "topic") {
    newmy = new topicmenu();
    newmy.items[0].url = newmy.items[0].url.replace("{openid}", message.FromUserName);
    return User.getUserOpenId(message.FromUserName, function(err, user) {
      console.log(newmy.items[0].url);
      if (user != null) {
        return Inte.getInteAll(user._id, function(err, count) {
          return callback(newmy);
        });
      } else {
        return callback(newmy);
      }
    });
  } else if (message.EventKey === "lucky") {
    newmy = new luckymenu();
    newmy.items[0].url = newmy.items[0].url.replace("{openid}", message.FromUserName);
    return User.getUserOpenId(message.FromUserName, function(err, user) {
      console.log(newmy.items[0].url);
      if (user != null) {
        return Inte.getInteAll(user._id, function(err, count) {
          return callback(newmy);
        });
      } else {
        return callback(newmy);
      }
    });
  } else if (message.EventKey === "game") {
    newmy = new gamemenu();
    newmy.items[0].url = newmy.items[0].url.replace("{openid}", message.FromUserName);
    return User.getUserOpenId(message.FromUserName, function(err, user) {
      console.log(newmy.items[0].url);
      if (user != null) {
        return Inte.getInteAll(user._id, function(err, count) {
          return callback(newmy);
        });
      } else {
        return callback(newmy);
      }
    });
  } else {
    return callback(empty);
  }
};


/*
--------------------------------------------
     Begin wechat-qa.coffee
--------------------------------------------
 */

myProcess = [];

getQA = function(message, openid, callback) {
  var key, qa, _n;
  key = message;
  console.log("user " + openid + " :", myProcess[openid]);
  if (myProcess[openid] != null) {
    qa = myProcess[openid];
    if (qa.next != null) {
      qa = myProcess[openid].next;
      qa = searchQA(key, qa);
      if (qa != null) {
        if (qa.next != null) {
          myProcess[openid] = qa;
        }
      } else {
        callback({});
      }
    }
  } else {
    myProcess[openid] = searchQA(key, _qa);
    qa = _n = myProcess[openid];
  }
  return callback(qa);
};

searchQA = function(key, list) {
  var a, _i, _len;
  for (_i = 0, _len = list.length; _i < _len; _i++) {
    a = list[_i];
    if (a.key === key) {
      return a;
    }
  }
  return null;
};

clearQA = function(openid) {
  console.log("clear: " + openid);
  return delete myProcess[openid];
};

overQA = function(openid, backup) {
  if (backup == null) {
    backup = "test";
  }
  console.log("记录抽奖ID: ", openid);
  clearQA(openid);
  return Inser_db_qauser(openid, backup);
};

_nr = "\n";

_qa = [
  {
    name: "查看活动详情",
    key: "1",
    type: "news",
    items: [
      {
        backContent: "活动详情",
        title: "Samsung GALAXY K zoom 让每个瞬间都精彩",
        description: '参与活动赢取Samsung GALAXY K zoom，开启你的幸福之旅~',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzNWR5PaQgtD89x9Drdb3oBEH7YOOcibiajvicowpicTgUjrlNzswycHMGPKjytQvc4icOqb3I627BnkWOQ/0",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200501036&idx=1&sn=7c19d06ff08719359639336eb357bbfe&scene=1&key=540a4984c4f01b4dfee5b42dd37ecdce5d742de5ce37445e8706c97c1def9f100a8bcf3813e0ea9f10b6acf5efa0d42b&ascene=0&uin=MjY4NjM5MDU%3D"
      }
    ]
  }
];
