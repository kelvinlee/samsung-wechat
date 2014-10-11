// Generated by CoffeeScript 1.7.1

/*
--------------------------------------------
     Begin wechat.coffee
--------------------------------------------
 */
var BufferHelper, Comment, EventProxy, Inte, Lots, Topic, User, Warehouse, checkMessage, checkSignature, clearQA, config, crypto, empty,luckyOver, formatMessage, fs, gamemenu, getMessage, getQA, jianxingpin, luckymenu, magazine, my, myProcess, newactive, overQA, oversite, path, plugs, plugs_menu, plugs_subscribe, regsinto, searchQA, topicmenu, videos, huishenghuo, welcometext, xml2js, _nr, _qa;

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

var middle = "/mid";

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
      return res.send(to ? parse.echostr : "v1.0.1");
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
/*
welcometext = function() {
  return {
    name: "新活动",
    key: "1",
    type: "news",
    items: [
      {
        title: "乐园嘉年华，关注赢好礼，GALAXY Tab S 等你来拿。",
        description: '乐园嘉年华，关注赢好礼，GALAXY Tab S 等你来拿。',
        picurl: "" + config.host + "/img/banner-1.jpg",
        url: "" + config.host + middle +"/{openid}?url=/page1"
      }, {
        title: "Samsung GALAXY Tab S 炫丽屏重新定义「视」界",
        description: 'Samsung GALAXY Tab S 炫丽屏重新定义「视」界',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzO0MI2JicM7fHVaiaQeTniaYBH9RQ1iaJH9XK6iatFxjdE8WQ8qFqEZ2MOz89T8ZcBBLJP9gIzH9pTbpeQ/0",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200559196&idx=1&sn=65df46c2bf8f852d815d3bb887c96ee2#rd"
      }, {
        title: "星炫刊 ︳我们与 Samsung GALAXY Tab S 的色彩故事",
        description: '星炫刊 ︳我们与 Samsung GALAXY Tab S 的色彩故事',
        picurl: config.host + "/img/icon-1.jpg",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=201614397&idx=1&sn=ae32c9b9fd34996932f72d4ee173b69c#rd"
      }, {
        title: "搜狐视频独播《巡夜人日志》第一集创韩国月火剧收视冠军！",
        description: '搜狐视频独播《巡夜人日志》第一集创韩国月火剧收视冠军！',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzPCniaCMicnMqqz1SFKI2coiaGOK1oLv8AmxicppGDsiatrJ1dP2t7VECcfwotwNthMUzysywXVckjmfrg/0",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=201179385&idx=1&sn=1e5ec46885ceabc0531703b442f0cce7#rd"
      }
    ]
  };
};
*/


welcometext = function() {
  return {
    name: "欢迎语",
  	key: "1",
 	type: "text",
 	content: "欢迎关注三星乐园"
  };
};


plugs_subscribe = function(message, callback) {
  var subscribe;
  subscribe = new welcometext();
  // subscribe.items[0].url = subscribe.items[0].url.replace("{openid}", message.FromUserName);
  return callback(subscribe);
};


/*
--------------------------------------------
     Begin wechat-menu.coffee
--------------------------------------------
 */

newactive = function() {
  return {
    name: "新·活动",
    key: "1",
    type: "news",
    items: [
      {
        title: "关注三星乐园微信公众账号,惊喜大礼等你拿",
        description: '关注三星乐园微信公众账号,惊喜大礼等你拿',
        picurl: "" + config.host + "/img/banner-1.jpg",
        url: "" + config.host + middle +"/{openid}?url=/page1"
      }, {
        title: "参与每日话题，赢取精美礼品",
        description: '参与每日话题，赢取精美礼品',
        picurl: "" + config.host + "/img/weixin-topic.jpg",
        url: "" + config.host + middle +"/{openid}?url=/sign/topic"
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
    name: "鉴·星品",
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
        title: "现实和想象之间，你只差一支S Pen！",
        description: '现实和想象之间，你只差一支S Pen！',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzOPwleqZ6YIf3gIpsbSpDAFWovUURD2hakiazSdwgiaFzO72OGvX9hGXQ7tCAGAX8A7Ih5icoDQRleYA/0",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200559196&idx=4&sn=84820a9612c169b067729da25596adfe#rd"
      }
    ]
  };
};

huishenghuo = function() {
  return {
    name: "绘·生活",
    key: "1",
    type: "news",
    items: [
      {
        title: "画你所想，写你所愿，S Pen-你的百变万能“喵”",
        description: '画你所想，写你所愿，S Pen-你的百变万能“喵”',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzP1TyW8z4q7t6ibibZVFKQFicMMKaqPml5WBaFIQ0x5uDic3cbr4hT2X2huDbx1YZsoyxT36YgYZ4fwicg/0",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=205066535&idx=1&sn=93628cb11f6fe5790852c60d6fde8306#rd"
      }, {
        title: "S Pen书写回忆，涂鸦童真",
        description: 'S Pen书写回忆，涂鸦童真',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzP1TyW8z4q7t6ibibZVFKQFicMPsuG3KIZPTpVtmL8FHPicTiaLkYJh0xF49ibr3312CJzibW17hAedsJAPg/0",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=205066535&idx=2&sn=fbca8f72a600e469a6908f8ea74920c8#rd"
      }, {
        title: "再忙也要甜蜜蜜，陪你去看流星雨",
        description: '再忙也要甜蜜蜜，陪你去看流星雨',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzP1TyW8z4q7t6ibibZVFKQFicMYV3WjPzZibkOF52h3xibyhSx4dGB3zNz19LxR2JQ48EL5qOpRO869BJg/0",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=205066535&idx=3&sn=65e5bb94d517337a5c8e9bd9c5f4aa73#rd"
      }, {
        title: "随心描绘百变美丽",
        description: '随心描绘百变美丽',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzP1TyW8z4q7t6ibibZVFKQFicMSeSQsZaaddmdttiaMY235wKry2epic8tjic7JicZmJ8Uia9qROVQXDFsdNg/0",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=205066535&idx=4&sn=aa75a5f9d8eadd02f91106c756cc36a2#rd"
      }, {
        title: "一起来“黑”家中萌宠",
        description: '一起来“黑”家中萌宠',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzP1TyW8z4q7t6ibibZVFKQFicMF79Iq6CgSzfMavfqsH6f6iaBgkKwcFDfxQmVe04QwvWa6A7NG5wKpvg/0",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=205066535&idx=5&sn=0ee2951577373dc9eba19844d68487f3#rd"
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
        title: "星炫刊 ︳Super AMOLED炫丽屏，定义「视」界新主张",
        description: '星炫刊 ︳Super AMOLED炫丽屏，定义「视」界新主张',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzM7uFF29KWYB3HePFqWtoicwicuEZJhh9GTibeBQibCugllg2uYSKzRzbJ1WOVEeibXDxQic3CicicOEEXdXw/0",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=201614397&idx=1&sn=ae32c9b9fd34996932f72d4ee173b69c#rd"
      }, {
        title: "时尚健康 | 时尚生活，健康领跑",
        description: '时尚健康 | 时尚生活，健康领跑',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzMFOibMfChYQiclHwBaGW7kfelthH4cVBruQJdPYXBHsvxia0uLhicE5ouT0o7A96yicZibPvby84gGpAPQ/0",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=205865171&idx=4&sn=f81e661685c4d360491b640b2fed2870#rd"
      }, {
        title: "伊周 | 精美图文，新鲜咨询，吃喝玩乐尽在指尖",
        description: '伊周 | 精美图文，新鲜咨询，吃喝玩乐尽在指尖',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzMFOibMfChYQiclHwBaGW7kfe7Mkweg0MghoHbxyTPIg1TmRy5eISGR3gSmJ7c3FdofCoDocEtLSaFg/0",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=205865171&idx=5&sn=c787241ec3eb51c787f0eed5d51e0fa0#rd"
      }, {
        title: "新潮电子 | 最精彩的数字时尚生活",
        description: '新潮电子 | 最精彩的数字时尚生活',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzP1TyW8z4q7t6ibibZVFKQFicMwASEEz0Sw43BmeYhsibMc3LIjlh1lSCOI6MFK012l0YrKyf7licUwDTA/0",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=201614397&idx=4&sn=979f46d7f03d3affdc746e27780e44b3#rd"
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
        url: "" + config.host + middle +"/{openid}?url=/sign/my"
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
        url: "" + config.host + middle +"/{openid}?url=/page7"
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
        url: "" + config.host + middle +"/{openid}?url=/sign/topic"
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
        url: "" + config.host + middle +"/{openid}?url=/sign/lucky"
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
        description: '点击玩·游戏，下载三星专版游戏，超级礼包等你来拿！',
        picurl: "" + config.host + "/img/banner-20.jpg",
        url: "" + config.host + middle +"/{openid}?url=/sign/exchange/1"
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
        title: "【刷新IQ神剧】年度巨制《北平无战事》洗脑来袭",
        description: '【刷新IQ神剧】年度巨制《北平无战事》洗脑来袭',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzMFOibMfChYQiclHwBaGW7kfeNvyWLZicWYBkmv8GDykg4D89ZV9h8ayZlxiaia2ClkLteaPsZf29T9IcQ/0",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=205865171&idx=1&sn=2c338b67e378feb6ed71d7d7fbe52cbb#rd"
      }, {
        title: "《我爱三星视频秀》54期：GALAXY Tab S 绚丽世界中的精彩应用",
        description: '《我爱三星视频秀》54期：GALAXY Tab S 绚丽世界中的精彩应用',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzPCniaCMicnMqqz1SFKI2coiaGqziaptWvH56GQd7HSR6MENCo9XD8YX37qKIjQAf4CND7xaicicjBiam0xA/0",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=201179385&idx=2&sn=350a13b6b1aabb9a27a7911309a73111#rd"
      }, {
        title: "【节后继续看大片】暴力美学电影伴你上班路赛过小长假",
        description: '【节后继续看大片】暴力美学电影伴你上班路赛过小长假',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzMFOibMfChYQiclHwBaGW7kfeGfShf8ZDicP4GpO6hrsHpcE01ibrkBq4BF4vRAdtQJcxKA1c1y0JrIgA/0",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=205865171&idx=2&sn=d72746762670b3259b106ea5f7115abe#rd"
      }, {
        title: "【我们结婚了】精灵夫妇——你有没有因为他们重新看我结？",
        description: '【我们结婚了】精灵夫妇——你有没有因为他们重新看我结？',
        picurl: "https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzMFOibMfChYQiclHwBaGW7kfecthmiattUgDibFPKhJvpuJ4JnsibtkS4M74Oz5HFxQI1nLARQSmPlGsNQ/0",
        url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=205865171&idx=3&sn=8c99defe8828486d9fb51fec89a7c963#rd"
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

luckyOver = {
  name: "活动已经结束.",
  key: "1",
  type: "text",
  backContent: ""
};

plugs_menu = function(message, callback) {
  var newmy;
  console.log(message);
  openid = message.FromUserName;
  User.getUserOpenId(openid, function(err, user) {
    console.log("openid:", openid, err, user);
    if (user != null) {
      // res.cookie("userid", user._id);
      // res.cookie("openid", openid);
      console.log({
        "老用户": true,
        user: user
      });
      // return res.redirect(url);
      plugs_event(message,callback);
    } else {
      return User.regbyOpenId(openid, function(err, user) {
        console.log(err, user);
        // res.cookie("userid", user._id);
        // res.cookie("openid", openid);
        return Inte.newInte(user._id, 100, "初次注册赠送积分活动,100积分", function(err, inte) {
          console.log({
            "老用户": false,
            user: user
          });
          // return res.redirect(url);
          plugs_event(message,callback);
        });
      });
    }
  });
};

plugs_event = function(message,callback) {
  if (message.EventKey === "oversite") {
    return callback(new oversite());
  } else if (message.EventKey === "jianxingpin") {
    return callback(new jianxingpin());
  } else if (message.EventKey === "huishenghuo") {
    return callback(new huishenghuo());
  } else if (message.EventKey === "magazine") {
    return callback(new magazine());
  } else if (message.EventKey === "newactive") {
    newmy = new newactive();
    newmy.items[0].url = newmy.items[0].url.replace("{openid}", message.FromUserName);
    newmy.items[1].url = newmy.items[1].url.replace("{openid}", message.FromUserName);
    return User.getUserOpenId(message.FromUserName, function(err, user) {
      if (user != null) {
        return Inte.getInteAll(user._id, function(err, count) {
          return callback(newmy);
        });
      } else {
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
    return callback(luckyOver);
	
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
}


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
