# 根据菜单参数跳转或返回对应数据.

plugs_menu = (message,callback)->
	if message.key is 'newsactive'
		callback welcometext
	callback welcometext