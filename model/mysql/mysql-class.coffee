mysql = require 'mysql'
config = require('../config').config


# connection = mysql.createConnection
# 	host: config.mydb
# 	user: config.db_user
# 	password : config.db_passwd
# 	database : config.db_database

connectionthis = (callback)->
	# connection.connect()
	callback.call mysql.createConnection
		host: config.mydb
		user: config.db_user
		password : config.db_passwd
		database : config.db_database
	# connection.end()

sql_select = (options) ->
	if options.tbname?
		$tbname = options.tbname
	else
		$tbname = "test"
	if options.where?
		$where=options.where
	else
		$where=false
	if options.limit?
		$limit=options.limit
	else
		$limit=false
	if options.fields?
		$fields=options.fields 
	else
		$fields="*" 
	if options.orderby?
		$orderby=options.orderby
	else
		$orderby="id"
	if options.sorts?
		$sort=options.sorts
	else
		$sort="DESC"

	$sql = "SELECT #{$fields} FROM `#{$tbname}` "+(if $where then "WHERE #{$where}" else "")+" ORDER BY #{$orderby} #{$sort} "+(if $limit then "limit #{$limit}" else "")
	# console.log "sql: #{$sql}"
	return $sql

sql_insert = (tbname)->
	sql = "INSERT INTO #{tbname} SET ?"
	# console.log "sql: #{sql}"
	return sql 

sql_update = (tbname,where,data)->
	sql = "UPDATE #{tbname} SET #{data} "+(if where then "WHERE #{where}" else "")
	# console.log "sql: #{sql}"
	return sql

sql_count = (tbname,where)->
	sql = "SELECT count(id) as row_sum FROM `#{tbname}` "+(if where? then " WHERE #{where}" else "")
	# console.log "sql: #{sql}"
	return sql

copy_table = (tbname,newtbname)->
	return "CREATE TABLE #{newtbname} LIKE #{tbname}"


exports.query = (sql,callback)->
	console.log sql
	connectionthis ->
		this.query sql,callback


exports.row_select = (options,callback)-> 
	# console.log sql_select(options)
	connectionthis -> 
		# if options.where?
		# 	this.query sql_select(options) , options.where, callback
		# else
		this.query sql_select(options) , callback

exports.row_insert = (tbname,data,callback)->
	connectionthis ->
		console.log "insert: ",data
		this.query sql_insert(tbname), data , callback

exports.row_update = (tbname,data,where,callback) ->
	connectionthis ->
		this.query sql_update(tbname,where,data), callback

exports.row_count = (tbname,where,callback)->
	console.log sql_count(tbname,where)
	connectionthis ->
		this.query sql_count(tbname,where), (err,result)->
			callback err,result[0].row_sum

exports.copy_table = (tbname,newtbname,callback)->
	connectionthis ->
		this.query copy_table(tbname,newtbname), callback

exports.check_table = (tbname,callback)->
	connectionthis ->
		this.query "SHOW TABLES LIKE '#{tbname}'",callback


