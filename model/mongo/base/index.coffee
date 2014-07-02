mongoose = require('mongoose')
config = require('../../../config').config
Schema = mongoose.Schema
ObjectId = Schema.ObjectId

mongoose.connect config.mdb, (err)->
  if err
    console.error('Connect to %s error: %s', config.mdb, err.message) 
    process.exit(1) 

# @codekit-append "user.coffee";
# @codekit-append "inte.coffee";
# @codekit-append "lots.coffee";
# @codekit-append "warehouse.coffee";

