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
				showalert "恭喜您今天签到成功了.",->
					window.location.href = "/sign/my"
			else
				showalert msg.reason,->
					window.location.href = "/sign/my"
	return false


showalert = (text,callback)->
	$(".alert").remove()
	al = $("<div>").addClass("alert")
	alc = $("<div>").addClass("alert-c")
	alc.text text
	al.append alc
	$("body").append al
	$(".alert").click ->
		$(".alert").remove()
		callback() if typeof callback is "function"



