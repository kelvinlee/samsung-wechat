// Generated by CoffeeScript 1.7.1
var CheckUsers, URL, access_token, checkMenus, checkToken, config, getAuUserInfo, getToken, getUToken, getUserInfo, getUsers, httpget, https, options_create_menu, options_custom, options_get_access_token, options_get_menu, options_send, options_token, options_user, options_user_info, options_userinfo, options_users, post_data, querystring, sendMenus;

https = require('https');

URL = require('url');

querystring = require('querystring');

config = require('../config').config;

access_token = {};

options_create_menu = {
  host: "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=",
  method: 'POST'
};

options_get_menu = {
  host: "https://api.weixin.qq.com/cgi-bin/menu/get?access_token=",
  method: 'GET'
};

options_get_menu = {
  host: "https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=",
  method: 'GET'
};

options_get_access_token = {
  host: "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + config.APPID + "&secret=" + config.SECRET,
  method: 'GET'
};

options_custom = {
  host: "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=",
  method: "POST"
};

options_send = {
  host: "https://api.weixin.qq.com/cgi-bin/message/send?access_token=",
  method: "POST"
};

options_users = {
  host: "https://api.weixin.qq.com/cgi-bin/user/get?access_token=",
  method: "GET"
};

options_user_info = {
  host: "https://api.weixin.qq.com/cgi-bin/user/info?lang=zh_CN&access_token=",
  method: "GET"
};

options_user = {
  regs: "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + config.APPID + "&redirect_uri=" + config.host + "/sign/in&response_type=code&scope=snsapi_base&state=in#wechat_redirect",
  my: "" + config.host + "/sign/my",
  exchange: "" + config.host + "/sign/exchange",
  lucky: "" + config.host + "/sign/lucky",
  topic: "" + config.host + "/sign/topic",
  method: "GET"
};

options_token = {
  host: "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + config.APPID + "&secret=" + config.SECRET + "&code={code}&grant_type=authorization_code",
  method: "GET"
};

options_userinfo = {
  host: "https://api.weixin.qq.com/sns/userinfo?access_token={token}&openid={OPENID}&lang=zh_CN",
  method: "GET"
};

post_data = {
  button: [
    {
      name: "游乐场",
      sub_button: [
        {
          type: "click",
          name: "新·活动",
          key: "newactive"
        }, {
          type: "click",
          name: "临·现场",
          key: "oversite"
        }, {
          type: "click",
          name: "聊·话题",
          key: "topic"
        }, {
          type: "click",
          name: "试·手气",
          key: "lucky"
        }
      ]
    }, {
      name: "星专享",
      sub_button: [
        {
          type: "click",
          name: "鉴·星品",
          key: "jianxingpin"
        }, {
          type: "click",
          name: "看·杂志",
          key: "magazine"
        }, {
          type: "click",
          name: "观·视频",
          key: "videos"
        }, {
          type: "click",
          name: "玩·游戏",
          key: "game"
        }
      ]
    }, {
      name: "园助手",
      sub_button: [
        {
          type: "view",
          name: "解·问题",
          url: config.host + "/page4"
        }, {
          type: "view",
          name: "寻·合作",
          url: config.host + "/page5"
        }, {
          type: "click",
          name: "查·积分",
          key: "my"
        }, {
          type: "click",
          name: "来·签到",
          key: "regsinto"
        }
      ]
    }
  ]
};

checkToken = function(callback) {
  if (access_token.date && access_token.date > new Date().getTime()) {
    callback(false);
    return true;
  } else {
    getToken(callback);
    return false;
  }
};

httpget = function(url, callback) {
  var request;
  request = https.get(url, callback);
  request.write('\n');
  return request.end();
};

getToken = function(callback) {
  return httpget(options_get_access_token.host, function(result) {
    console.log('STATUS: ' + result.statusCode);
    console.log('HEADERS: ' + JSON.stringify(result.headers));
    result.setEncoding('utf8');
    return result.on('data', function(chunk) {
      var obj;
      console.log('BODY: ' + chunk);
      obj = JSON.parse(chunk);
      if (obj.access_token) {
        access_token = obj;
        access_token.date = new Date().getTime() + obj.expires_in * 1000;
        return callback(false);
      } else {
        return callback('There is no token');
      }
    });
  });
};

sendMenus = function() {
  var op, p, request, u;
  u = URL.parse(options_create_menu.host);
  p = u['port'] ? u['port'] : 80;
  op = {
    hostname: u['host'],
    port: 443,
    path: u['path'] + access_token.access_token,
    method: 'POST'
  };
  console.log(op, p);
  request = https.request(op, function(res) {
    console.log("statusCode: ", res.statusCode);
    console.log("headers: ", res.headers);
    return res.on('data', function(chunk) {
      var obj;
      obj = JSON.parse(chunk);
      return console.log(obj);
    });
  });
  console.log(JSON.stringify(post_data));
  request.write(JSON.stringify(post_data) + '\n');
  return request.end();
};

exports.sendMenus = function() {
  return checkToken(function(err) {
    return sendMenus();
  });
};

checkMenus = function() {
  return httpget(options_get_menu.host + access_token.access_token, function(res) {
    console.log("statusCode: ", res.statusCode);
    console.log("headers: ", res.headers);
    return res.on('data', function(chunk) {
      var obj;
      obj = JSON.parse(chunk);
      return console.log(obj);
    });
  });
};

exports.checkMenus = checkMenus;

getUsers = function(Next_OpenID) {
  if (Next_OpenID === "start" || Next_OpenID) {
    return httpget(options_users.host + access_token.access_token, function(res) {
      return res.on('data', function(chunk) {
        var obj;
        obj = JSON.parse(chunk);
        console.log(obj);
        return CheckUsers(obj);
      });
    });
  }
};

exports.getUsers = getUsers;

CheckUsers = function(obj) {
  if (obj.next_openid) {
    return getUsers(obj.next_openid);
  }
};

exports.CheckUsers = CheckUsers;

getUserInfo = function(openid) {
  var request;
  request = https.get(options_user_info.host + access_token.access_token + "&openid=" + openid, function(res) {
    console.log("statusCode: ", res.statusCode);
    console.log("headers: ", res.headers);
    return res.on('data', function(chunk) {
      var obj;
      obj = JSON.parse(chunk);
      return console.log(obj);
    });
  });
  request.write('\n');
  return request.end();
};

exports.getUserInfo = getUserInfo;

getUToken = function(code, callback) {
  var url;
  url = options_token.host.replace("{code}", code);
  return httpget(url, callback);
};

exports.getUToken = getUToken;

getAuUserInfo = function(token, openid, callback) {
  var url;
  url = options_userinfo.host.replace("{token}", token);
  url = url.replace("{openid}", openid);
  return httpget(url, callback);
};

exports.getAuUserInfo = getAuUserInfo;
