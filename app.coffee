# app.js for production
path = require 'path'
express = require 'express'
#var io = require socket.io').listen(server); 
config = require('./config').config
routes = require './routes'
fs = require 'fs'

# sign = require "./controllers/sign"

app = express()

# here the middleware , cookies , postbody.
cookieParser = require('cookie-parser')
bodyParser = require('body-parser')

app.use cookieParser()
app.use bodyParser.urlencoded
	extended: true
app.use bodyParser.json()

# configuration in all env 
viewsRoot = path.join __dirname, 'view'
app.set 'views', viewsRoot
app.set 'view engine', 'jade'



# must need next() go to next page.
app.use (req,res,next)->
  res.locals.config = config 
  next()
# app.use sign.userinfo
# app.use sign.default

staticDir = path.join __dirname, 'public'
activeDir = path.join __dirname, 'active'
app.use express.static staticDir
app.use express.static activeDir

routes app

app.listen config.port,config.ip

console.log "Node Web Start."