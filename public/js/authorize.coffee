# @codekit-prepend "js/vendor/Zepto.min.js"
# @codekit-prepend "coffee/plugs.coffee";

document.addEventListener 'WeixinJSBridgeReady', ->
	# alert $("#newpage").attr "href"
	window.location.href = $("#newpage").attr "href"

