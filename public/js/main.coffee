# @codekit-prepend "js/vendor/Zepto.min.js"
# @codekit-prepend "coffee/plugs.coffee"


$(document).ready ->

qiandao = ->
	$.ajax
		url: '/sign/tointe'
		type: 'GET'
		dataType: 'json',
		success: (msg)->
			if msg.recode is 200
				alert "恭喜您今天签到成功了."
				window.location.reload()
			else
				alert msg.reason
	return false