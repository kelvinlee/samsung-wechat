// Generated by CoffeeScript 1.7.1
var activeDir, app, bodyParser, config, cookieParser, express, fs, path, routes, staticDir, viewsRoot;

path = require('path');

express = require('express');

config = require('./config').config;

routes = require('./routes');

fs = require('fs');

app = express();

cookieParser = require('cookie-parser');

bodyParser = require('body-parser');

app.use(cookieParser());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

viewsRoot = path.join(__dirname, 'view');

app.set('views', viewsRoot);

app.set('view engine', 'jade');

app.use(function(req, res, next) {
  res.locals.config = config;
  return next();
});

staticDir = path.join(__dirname, 'public');

activeDir = path.join(__dirname, 'active');

app.use(express["static"](staticDir));

app.use(express["static"](activeDir));

routes(app);

app.listen(config.port, config.ip);

console.log("Node Web Start.");
