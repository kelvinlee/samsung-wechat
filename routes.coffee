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

  # app.get "/sign/*", sign.before
  app.get "/sign/in", sign.in
  app.get "/sign/my", sign.my
  app.get "/sign/exchange", sign.exchange
  app.get "/sign/exchange/:type_id", sign.exchange_type
  app.get "/sign/lucky", sign.lucky
  app.get "/sign/tointe", sign.tointe

  # app.get '*', note.notfind

console.log "routes loaded."