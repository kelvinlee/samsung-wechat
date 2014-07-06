# 根据菜单参数跳转或返回对应数据.

newactive = {
	name:"查看活动详情"
	key:"1"
	type:"news"
	backContent :"活动详情"
	title:"临·现场"
	description: '临·现场'
	picurl:"https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzO6ZUIrhM8bc1FQxoQAIggvhSkRKbz4gVROjv5MeibQOaRvAKMXFxa6oBicAoMYVRKOekMicUEEyOIww/0"
	url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200198976&idx=1&sn=f0508d0792f15fc2c812fe77a04192b6#rd"
}
oversite = {
	name:"查看活动详情"
	key:"1"
	type:"news"
	backContent :"活动详情"
	title:"临·现场"
	description: '临·现场'
	picurl:"https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzO6ZUIrhM8bc1FQxoQAIggvhSkRKbz4gVROjv5MeibQOaRvAKMXFxa6oBicAoMYVRKOekMicUEEyOIww/0"
	url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200198976&idx=1&sn=f0508d0792f15fc2c812fe77a04192b6#rd"
	
}
jianxingpin = {
	name:"查看活动详情"
	key:"1"
	type:"news"
	backContent :"活动详情"
	title:"鉴·星品"
	description: '鉴·星品'
	picurl:"https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzO6ZUIrhM8bc1FQxoQAIggvhSkRKbz4gVROjv5MeibQOaRvAKMXFxa6oBicAoMYVRKOekMicUEEyOIww/0"
	url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200198976&idx=1&sn=f0508d0792f15fc2c812fe77a04192b6#rd"
	
}
magazine = {
	name:"查看活动详情"
	key:"1"
	type:"news"
	backContent :"活动详情"
	title:"看·杂志"
	description: '看·杂志'
	picurl:"https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzO6ZUIrhM8bc1FQxoQAIggvhSkRKbz4gVROjv5MeibQOaRvAKMXFxa6oBicAoMYVRKOekMicUEEyOIww/0"
	url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200198976&idx=1&sn=f0508d0792f15fc2c812fe77a04192b6#rd"
	
}
empty = {
	name:"返回收到图片信息."
	key:"1"
	type:"text" 
	backContent: ""
}
plugs_menu = (message,callback)->
	console.log message
	if message.key is "oversite"
		callback oversite
	else if message.key is "jianxingpin"
		callback jianxingpin
	else if message.key is "magazine"
		callback magazine
	else if message.key is "newactive"
		callback newactive
	else
		callback empty

	# callback welcometext