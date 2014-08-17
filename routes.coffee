# art = require './controllers/art'
wechat = require './controllers/wechat'
sign = require './controllers/sign'
admin = require './controllers/admin'
# git = require './controllers/git'
# admin = require './controllers/admin'


# note = require './controllers/note'

module.exports = (app)->
  app.get '/', wechat.index
  app.post '/', wechat.index

  app.get '/menu', wechat.sendmenu
  # app.get '/checkmenu', wechat.checkMenus


  app.get "/page1", sign.page1
  app.get "/page2", sign.page2
  app.get "/page3", sign.page3
  app.get "/page4", sign.page4
  app.get "/page5", sign.page5
  app.get "/page6", sign.page6
  app.get "/page7", sign.page7
  app.get "/page8", sign.page8
  app.get "/game", sign.game
  app.get "/share/:info", sign.share
  
  app.get "/art/:art_id", sign.art
  app.get "/active/:ac_id", sign.active

  app.get "/middle/:openid", sign.middle
  
  


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
  app.get "/sign/luckyframe", sign.luckyframe
  # 每日签到
  app.get "/sign/tointe", sign.tointe

  # 论坛
  app.get "/sign/topic", sign.topic
  app.post "/sign/comment", sign.comment
  app.get "/sign/comments", sign.comments

  # 设置昵称
  app.get "/nickname", sign.nickname
  app.post "/sign/nickname", sign.postnickname

  # 中奖页面
  app.get "/sign/lots", sign.lots
  app.get "/sign/winner/:winner_id", sign.winner
  app.post "/sign/winner/:winner_id", sign.winner_post

  app.get "/admin/lot", admin.addlot
  app.post "/admin/lot/:lot_type", admin.postaddlot
  app.get "/admin/topic", admin.topic
  app.post "/admin/topic", admin.setDefaultTopic
  app.get "/admin/delcomment/:c_id", admin.delcomment
  app.get "/admin/newtopic", admin.newtopic
  app.get "/admin/deltopic/:t_id", admin.deltopic

  app.get "/admin/lucky", admin.lucky
  app.get "/admin/topiclot", admin.topiclot

  app.get "/sign/topiclot", sign.topic_lot_list



  # app.get '*', note.notfind

console.log "routes loaded."