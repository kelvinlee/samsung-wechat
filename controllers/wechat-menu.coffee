# 根据菜单参数跳转或返回对应数据.

newactive = {
	name:"新活动"
	key:"1"
	type:"news"
	items:[
		{
			title:"关注三星乐园微信公众账号,惊喜大礼等你拿!"
			description: '关注三星乐园微信公众账号,惊喜大礼等你拿!'
			picurl:"http://115.28.106.34/img/banner-1.jpg"
			url: "http://115.28.106.34/art/1"
		}
		{
			title:"GALAXY K zoom让每个瞬间都精彩!"
			description: 'GALAXY K zoom让每个瞬间都精彩!'
			picurl:"https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzPrkjqVuXnZk7kv2dM1ed7uuJ11IicjPwfuicc6tmAVhrLyolJTe2oThaatNbInYZBdmBAlJMWfrZqw/0"
			url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200501036&idx=1&sn=7c19d06ff08719359639336eb357bbfe#rd"
		}
		{
			title:"“装女郎梦想秀”全国网络15强海选活动开始啦!"
			description: '“装女郎梦想秀”全国网络15强海选活动开始啦!'
			picurl:"http://115.28.106.34/img/banner-2.jpg"
			url: "http://115.28.106.34/art/2"
		}
	]
}
oversite = {
	name:"临·现场"
	key:"1"
	type:"news"
	items:[
		{
			title:"10 倍光变拉近精彩三星发布全新智能手机 GALAXY K zoom"
			description: '三星乐园微信平台临现场，体验活动现场的火热气氛，身临其境！'
			picurl:"http://115.28.106.34/img/banner-7.jpg"
			url: "http://115.28.106.34/art/6"
		}
	]
	
}
jianxingpin = {
	name:"鉴星品"
	key:"1"
	type:"news"
	items:[
		{
			title:"Samsung GALAXY K zoom你的手机会变焦吗?"
			description: '带上K zoom捕获精彩瞬间,随时随地轻松分享.'
			picurl:"http://115.28.106.34/img/banner-6.jpg"
			url: "http://115.28.106.34/art/6"
		}
	]
	
}
magazine = {
	name:"看杂志"
	key:"1"
	type:"news"
	items: [
		{
			title:"新炫刊 安卓平台最棒的杂志应用"
			description: '新炫刊 安卓平台最棒的杂志应用'
			picurl:"http://115.28.106.34/img/banner-3.jpg"
			url: "http://115.28.106.34/art/3"
		}
		{
			title:"GQ智族 --- 顶级男性杂志"
			description: 'GQ智族 --- 顶级男性杂志'
			picurl:"http://115.28.106.34/img/banner-4.jpg"
			url: "http://115.28.106.34/art/4"
		}
		{
			title:"瑞丽---开创时尚杂志的实用化先河"
			description: '瑞丽---开创时尚杂志的实用化先河'
			picurl:"http://115.28.106.34/img/banner-5.jpg"
			url: "http://115.28.106.34/art/5"
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