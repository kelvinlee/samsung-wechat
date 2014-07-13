# art = require './controllers/art'
wechat = require './controllers/wechat'
sign = require './controllers/sign'
# git = require './controllers/git'
# admin = require './controllers/admin'


# note = require './controllers/note'

module.exports = (app)->
  app.get '/', wechat.index
  app.post '/', wechat.index

  app.get '/menu', wechat.sendmenu


  app.get "/page1", sign.page1
  app.get "/page2", sign.page2
  app.get "/page3", sign.page3
  app.get "/page4", sign.page4
  app.get "/page5", sign.page5
  app.get "/page6", sign.page6
  app.get "/page7", sign.page7
  
  app.get "/art/:art_id", sign.art
  app.get "/active/:ac_id", sign.active

  app.get "/middle", sign.middle
  # 登录
  app.get "/login", sign.in
  # 登录提交
  app.post "/login/in", sign.in_post
  # 注册
  app.get "/reg", sign.up
  # 注册提交
  app.post "/reg/up",sign.up_post

  # 验证用户.
  app.get "/sign/*", sign.before
  app.post "/sign/*", sign.before
  # 个人信息
  app.get "/sign/my", sign.my
  # 我的奖品/兑换后界面
  app.get "/sign/mylot/:lot_id", sign.mylot
  # 奖品兑换
  app.get "/sign/exchange", sign.exchange
  app.get "/sign/exchange/:type_id", sign.exchange_type
  app.get "/sign/exchangelot/:lots_id", sign.exchangelot
  # 抽奖
  app.get "/sign/lucky", sign.lucky
  app.get "/sign/getlucky", sign.getlucky
  # 每日签到
  app.get "/sign/tointe", sign.tointe

  # 论坛
  app.get "/sign/topic", sign.topic
  app.post "/sign/comment", sign.comment
  app.get "/sign/comments", sign.comments

  # app.get '*', note.notfind

console.log "routes loaded."