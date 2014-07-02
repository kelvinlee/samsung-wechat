# 基本类库
fs = require 'fs'
path = require 'path'
crypto = require 'crypto'

# 扩展类库
EventProxy = require 'eventproxy'
config = require('../config').config

exports.event = (req,res,next)->
	# body...