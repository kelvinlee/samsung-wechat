# 根据菜单参数跳转或返回对应数据.

newactive = {
	name:"新活动"
	key:"1"
	type:"news"
	items:[
		{
			backContent :"关注三星乐园微信公众账号"
			title:"关注三星乐园微信公众账号,惊喜大礼等你拿!"
			description: '关注三星乐园微信公众账号,惊喜大礼等你拿!'
			picurl:"http://115.28.106.34/img/banner-1.jpg"
			url: "http://115.28.106.34/art/1"
		}
		{
			backContent :"GALAXY K zoom让每个瞬间都精彩"
			title:"GALAXY K zoom让每个瞬间都精彩!"
			description: 'GALAXY K zoom让每个瞬间都精彩!'
			picurl:"https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzPrkjqVuXnZk7kv2dM1ed7uuJ11IicjPwfuicc6tmAVhrLyolJTe2oThaatNbInYZBdmBAlJMWfrZqw/0"
			url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200501036&idx=1&sn=7c19d06ff08719359639336eb357bbfe#rd"
		}
		{
			backContent :"关注三星乐园微信公众账号"
			title:"“装女郎梦想秀”全国网络15强海选活动开始啦!"
			description: '“装女郎梦想秀”全国网络15强海选活动开始啦!'
			picurl:"http://115.28.106.34/img/banner-2.jpg"
			url: "http://115.28.106.34/art/2"
		}
	]
}
oversite = {
	name:"查看活动详情"
	key:"1"
	type:"news"
	items:[
		{
			backContent :"活动详情"
			title:"临·现场"
			description: '临·现场'
			picurl:"https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzO6ZUIrhM8bc1FQxoQAIggvhSkRKbz4gVROjv5MeibQOaRvAKMXFxa6oBicAoMYVRKOekMicUEEyOIww/0"
			url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200198976&idx=1&sn=f0508d0792f15fc2c812fe77a04192b6#rd"
		}
	]
	
}
jianxingpin = {
	name:"查看活动详情"
	key:"1"
	type:"news"
	items:[
		{
			backContent :"活动详情"
			title:"鉴·星品"
			description: '鉴·星品'
			picurl:"https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzO6ZUIrhM8bc1FQxoQAIggvhSkRKbz4gVROjv5MeibQOaRvAKMXFxa6oBicAoMYVRKOekMicUEEyOIww/0"
			url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200198976&idx=1&sn=f0508d0792f15fc2c812fe77a04192b6#rd"
		}
	]
	
}
magazine = {
	name:"查看活动详情"
	key:"1"
	type:"news"
	items: [
		{
			backContent :"活动详情"
			title:"看·杂志"
			description: '看·杂志'
			picurl:"https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzO6ZUIrhM8bc1FQxoQAIggvhSkRKbz4gVROjv5MeibQOaRvAKMXFxa6oBicAoMYVRKOekMicUEEyOIww/0"
			url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200198976&idx=1&sn=f0508d0792f15fc2c812fe77a04192b6#rd"
		}
	]
}
empty = {
	name:"返回收到图片信息."
	key:"1"
	type:"text" 
	backContent: ""
}
plugs_menu = (message,callback)->
	console.log message
	if message.EventKey is "oversite"
		callback oversite
	else if message.EventKey is "jianxingpin"
		callback jianxingpin
	else if message.EventKey is "magazine"
		callback magazine
	else if message.EventKey is "newactive"
		callback newactive
	else
		callback empty

	# callback welcometext