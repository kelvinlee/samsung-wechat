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


  # app.get "/sign/*", sign.before
  app.get "/sign/in", sign.in
  app.get "/sign/my", sign.my
  app.get "/sign/exchange", sign.exchange
  app.get "/sign/exchange/:type_id", sign.exchange_type
  app.get "/sign/lucky", sign.lucky
  app.get "/sign/tointe", sign.tointe

  # app.get '*', note.notfind

console.log "routes loaded."