crypto = require 'crypto'

exports.format_date = (date, friendly)->
	year = date.getFullYear()
	month = date.getMonth() + 1
	day = date.getDate()
	hour = date.getHours()
	minute = date.getMinutes()
	second = date.getSeconds()
	if friendly
		now = new Date()
		mseconds = -(date.getTime() - now.getTime())
		time_std = [ 1000, 60 * 1000, 60 * 60 * 1000, 24 * 60 * 60 * 1000 ]
		if mseconds < time_std[3]
			return Math.floor(mseconds / time_std[0]).toString() + ' 秒前' if mseconds > 0 && mseconds < time_std[1]
			return Math.floor(mseconds / time_std[1]).toString() + ' 分钟前' if mseconds > time_std[1] && mseconds < time_std[2]
			return Math.floor(mseconds / time_std[2]).toString() + ' 小时前' if mseconds > time_std[2]

	month = (if month<10 then '0' else '') + month;
	day = (if day<10 then '0' else '') + day;
	hour = (if hour<10 then '0' else '') + hour
	minute = (if minute<10 then '0' else '') + minute
	second = (if second<10 then '0' else '') + second
	thisYear = new Date().getFullYear()
	year = (thisYear is year) ? '' : (year + '-')
	year + month + '-' + day + ' ' + hour + ':' + minute

#
# 加密字符串
#
# @param {string}
# @return {string}
#
encrypt = (str, secret)->
	cipher = crypto.createCipher 'aes192', secret
	enc = cipher.update str, 'utf8', 'hex'
	enc += cipher.final 'hex'
	return enc
exports.encrypt = encrypt

#
# 解密字符串
#
# @param {string}
# @return {string}
#
decrypt = (str, secret)->
	decipher = crypto.createDecipher 'aes192', secret
	dec = decipher.update str, 'hex', 'utf8'
	dec += decipher.final 'utf8'
	return dec
exports.decrypt = decrypt

#
# 返回默认json
#
# @param {}
# @return {json}
#
recode = ()->
	return {recode:200,reason:"success"}
exports.recode = recode


#
# 返回默认string
#
# @param {json}
# @return {string}
#
arstr = (data,str=",")->
	newdata = ""
	for k,v of data
		newdata += "`#{k}`='#{v}' #{str}"
	newdata = newdata.substring 0,newdata.length-str.length
exports.arstr = arstr


