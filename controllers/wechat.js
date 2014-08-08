// Generated by CoffeeScript 1.7.1

/*
--------------------------------------------
     Begin wechat.coffee
--------------------------------------------
 */
var BufferHelper, Comment, EventProxy, Inte, Lots, Topic, User, Warehouse, checkMessage, checkSignature, clearQA, config, crypto, empty, formatMessage, fs, gamemenu, getMessage, getQA, jianxingpin, luckymenu, magazine, my, myProcess, newactive, overQA, oversite, path, plugs, plugs_menu, plugs_subscribe, regsinto, searchQA, topicmenu, videos, welcometext, xml2js, _nr, _qa;

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

welcometext = function() {
  return {
    name: "新活动",
    key: "1",
    type: "news",
    items: [
      {
        title: "乐园嘉年华，关注赢好礼。您已获得100积分，快去游乐场试手气吧！",
        description: '乐园嘉年华，关注赢好礼。您已获得100积分，快去游乐场试手气吧！',
        picurl: "" + config.host + "/img/banner-1.jpg",
        url: "" + config.host + "/middle/{openid}?url=/page1"
      }, {
        title: "Samsung GALAXY Tab S 炫丽屏重新定义「视」界",
        description: 'Samsung GALAXY Tab S 炫丽屏重新定义「视」界',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzO0MI2JicM7fHVaiaQeTniaYBH9RQ1iaJH9XK6iatFxjdE8WQ8qFqEZ2MOz89T8ZcBBLJP9gIzH9pTbpeQ/0",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200559196&idx=1&sn=65df46c2bf8f852d815d3bb887c96ee2#rd"
      }, {
        title: "新潮电子 ︳Samsung GALAXY K zoom 极视界 致手机",
        description: '新潮电子 ︳Samsung GALAXY K zoom 极视界 致手机',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzPCniaCMicnMqqz1SFKI2coiaGG6uUDMBE7qiaVlx22cbJ66bDicun4KicAIwnQNVa1vLFcMhViaoqyEbPLQ/0",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200559296&idx=1&sn=15090e2e6a8708a6cf9e5373dcf061a8#rd"
      }, {
        title: "搜狐视频独播《巡夜人日志》第一集创韩国月火剧收视冠军！",
        description: '搜狐视频独播《巡夜人日志》第一集创韩国月火剧收视冠军！',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzPCniaCMicnMqqz1SFKI2coiaGOK1oLv8AmxicppGDsiatrJ1dP2t7VECcfwotwNthMUzysywXVckjmfrg/0",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=201179385&idx=1&sn=1e5ec46885ceabc0531703b442f0cce7#rd"
      }
    ]
  };
};

plugs_subscribe = function(message, callback) {
  var newmy;
  newmy = new welcometext();
  newmy.items[0].url = newmy.items[0].url.replace("{openid}", message.FromUserName);
  return callback(newmy);
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
        title: "关注三星乐园微信公众账号,惊喜大礼等你拿",
        description: '关注三星乐园微信公众账号,惊喜大礼等你拿',
        picurl: "" + config.host + "/img/banner-1.jpg",
        url: "" + config.host + "/middle/{openid}?url=/page1"
      }, {
        title: "参与每日话题，赢取精美礼品",
        description: '参与每日话题，赢取精美礼品',
        picurl: "" + config.host + "/img/weixin-topic.jpg",
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
        description: '【2014 年 7 月 7 日，上海】三星电子于上海世博创意秀场正式推出旗下迄今最轻薄的平板电脑 GALAXY Tab S，为中国消费者揭开了这款万众期待的平板电脑的神秘面纱。',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzO0MI2JicM7fHVaiaQeTniaYBHfExcwyqI7M2wbuPcJwiaKmWASIhFeNMc9jLy5p0xevNicFme4oeic1lZg/0",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200559799&idx=1&sn=9f9276bef86f5fa505897df138559a31#rd"
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
        title: "Samsung GALAXY Tab S 炫丽屏重新定义「视」界",
        description: 'Samsung GALAXY Tab S 炫丽屏重新定义「视」界',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzO0MI2JicM7fHVaiaQeTniaYBH9RQ1iaJH9XK6iatFxjdE8WQ8qFqEZ2MOz89T8ZcBBLJP9gIzH9pTbpeQ/0",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200559196&idx=1&sn=65df46c2bf8f852d815d3bb887c96ee2#rd"
      }, {
        title: "Samsung GALAXY Tab S Super AMOLED 介绍",
        description: 'Super AMOLED 介绍',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzO0MI2JicM7fHVaiaQeTniaYBHRQObuicHPsbAsdZxcVuoqNiatI3jCoVOmiaqtYGV0ObgL4KESxVmnk6Qw/0",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200559196&idx=2&sn=e63c12ed63c62ade95295f7f04570a01#rd"
      }, {
        title: "Samsung GALAXY K zoom 让每个瞬间都精彩",
        description: 'Samsung GALAXY K zoom 让每个瞬间都精彩',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzO0MI2JicM7fHVaiaQeTniaYBH6fTuuEtLsy7fGvZsBflV9SOpY5iacHiaDd056ZA3aq8HGPxEzzpEq5aw/0",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200559196&idx=3&sn=a3cefce3da85b400072a9303de8be9e4#rd"
      }, {
        title: "Samsung GALAXY S Pen 笔随心动，点滴记录",
        description: 'Samsung GALAXY S Pen 笔随心动，点滴记录',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzPCniaCMicnMqqz1SFKI2coiaGPFib5A84LCWuIS7LAKlAqE1al4wd4dWoXUlhcbfGBtLq5dJgjQeCCUQ/0",
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
        title: "新潮电子 ︳Samsung GALAXY K zoom 极视界 致手机",
        description: '新潮电子 ︳Samsung GALAXY K zoom 极视界 致手机',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzPCniaCMicnMqqz1SFKI2coiaGG6uUDMBE7qiaVlx22cbJ66bDicun4KicAIwnQNVa1vLFcMhViaoqyEbPLQ/0",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200559296&idx=1&sn=15090e2e6a8708a6cf9e5373dcf061a8#rd"
      }, {
        title: "华夏地理 ︳国宝浙江",
        description: '华夏地理 ︳国宝浙江',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzPCniaCMicnMqqz1SFKI2coiaGXeDqDHibykBPPSXHxggTYdKbhOJPj81mkZnSiciahfEESnrIhLQZdtbkg/0",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200559296&idx=2&sn=b050f7dfe3e5aab18f1a667413318631#rd"
      }, {
        title: "瑞丽服饰美容 ︳戴对表，秒变韩剧女主角",
        description: '瑞丽服饰美容 ︳戴对表，秒变韩剧女主角',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzPCniaCMicnMqqz1SFKI2coiaGHS2qliaoQ2yDM8jvVggzoWSmaTor6FJvJLfviahUzrnvnoAFtomNSSNA/0",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200559296&idx=3&sn=357c8eb2b5550bd4d9cac3fc3c284f8e#rd"
      }, {
        title: "时尚芭莎 ︳Angelababy 活得开心 做到最好",
        description: '时尚芭莎 ︳Angelababy 活得开心 做到最好',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzPCniaCMicnMqqz1SFKI2coiaGbeZ5fIhQV8m9Lw712mtOYb01aden2Vsa7Jr9FmtpDnPpHp0zcjKsug/0",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200559296&idx=4&sn=2581fb570a19e435c6b35050598a9444#rd"
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
        title: "参与每日话题，赢取精美礼品",
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

videos = function() {
  return {
    name: "观视频",
    key: "1",
    type: "news",
    items: [
      {
        title: "搜狐视频独播《巡夜人日志》第一集创韩国月火剧收视冠军！",
        description: '搜狐视频独播《巡夜人日志》第一集创韩国月火剧收视冠军！',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzPCniaCMicnMqqz1SFKI2coiaGOK1oLv8AmxicppGDsiatrJ1dP2t7VECcfwotwNthMUzysywXVckjmfrg/0",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=201179385&idx=1&sn=1e5ec46885ceabc0531703b442f0cce7#rd"
      }, {
        title: "《我爱三星视频秀》54期：GALAXY Tab S 绚丽世界中的精彩应用",
        description: '《我爱三星视频秀》54期：GALAXY Tab S 绚丽世界中的精彩应用',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzPCniaCMicnMqqz1SFKI2coiaGqziaptWvH56GQd7HSR6MENCo9XD8YX37qKIjQAf4CND7xaicicjBiam0xA/0",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=201179385&idx=2&sn=350a13b6b1aabb9a27a7911309a73111#rd"
      }, {
        title: "《Jessica&Krystal》收官，闪瞎综艺档收视率！",
        description: '《Jessica&Krystal》收官，闪瞎综艺档收视率！',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzPCniaCMicnMqqz1SFKI2coiaGv3CLYhYoyKuKNkdR1dsm176WaXIR4zFbN5k2gMp7j3hlb4PDzlyULQ/0",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=201179385&idx=3&sn=ce36d8402e61e53e5267fe02997b2f13#rd"
      }, {
        title: "搜狐入股金秀贤所属公司Keyeast 成第二大股东",
        description: '搜狐入股金秀贤所属公司Keyeast 成第二大股东',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzPCniaCMicnMqqz1SFKI2coiaGbevib8u2iarKiaj7jcoYQPMYxpUMN3GPmFcNK1UumNBef7y8RejjVWqEw/0",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=201179385&idx=4&sn=2c0626281303dc2a457914ab10761355#rd"
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
    newmy = new newactive();
    newmy.items[0].url = newmy.items[0].url.replace("{openid}", message.FromUserName);
    newmy.items[2].url = newmy.items[2].url.replace("{openid}", message.FromUserName);
    return User.getUserOpenId(message.FromUserName, function(err, user) {
      console.log(newmy.items[2].url);
      if (user != null) {
        return Inte.getInteAll(user._id, function(err, count) {
          newmy.items[2].description = newmy.items[2].description.replace("{jf}", count);
          return callback(newmy);
        });
      } else {
        newmy.items[2].description = newmy.items[2].description.replace("{jf}", "0");
        return callback(newmy);
      }
    });
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
  } else if (message.EventKey === "videos") {
    newmy = new videos();
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
