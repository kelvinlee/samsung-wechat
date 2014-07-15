# @codekit-prepend "js/vendor/Zepto.min.js"
# @codekit-prepend "coffee/plugs.coffee"


$(document).ready ->

__qiaodao = false;
qiandao = ->
	if __qiaodao
		alert("正在签到,请稍后");
		return ""
	__qiaodao = true;
	$.ajax
		url: '/sign/tointe'
		type: 'GET'
		dataType: 'json',
		success: (msg)->
			__qiaodao = false;
			if msg.recode is 200
				alert "恭喜您今天签到成功了."
				# window.location.reload()
				window.location.href = "/sign/my"
			else
				alert msg.reason
	return false