# 根据菜单参数跳转或返回对应数据.

newactive = {
	name:"新活动"
	key:"1"
	type:"news"
	items:[
		{
			title:"关注三星乐园微信公众账号,惊喜大礼等你拿!"
			description: '关注三星乐园微信公众账号,惊喜大礼等你拿!'
			picurl:"#{config.host}/img/banner-1.jpg"
			url: "#{config.host}/art/1"
		}
		{
			title:"GALAXY K zoom让每个瞬间都精彩!"
			description: 'GALAXY K zoom让每个瞬间都精彩!'
			picurl:"https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzPrkjqVuXnZk7kv2dM1ed7uuJ11IicjPwfuicc6tmAVhrLyolJTe2oThaatNbInYZBdmBAlJMWfrZqw/0"
			url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200501036&idx=1&sn=7c19d06ff08719359639336eb357bbfe#rd"
		}
		{
			title:"参与话题#最让你遗憾的事#人非圣贤，孰能无悔！足球月里，让你最遗憾的那些事儿！"
			description: '参与话题#最让你遗憾的事#人非圣贤，孰能无悔！足球月里，让你最遗憾的那些事儿！'
			picurl:"#{config.host}/img/banner-10.jpg"
			url: "#{config.host}/sign/topic"
		}
	]
}

oversite = {
	name:"临·现场"
	key:"1"
	type:"news"
	items:[
		{
			title:"重新定义“视”界 三星 GALAXY Tab S 开启色彩大门"
			description: '揭开万众期待的神秘面纱，三星 GALAXY Tab S为你开启全新的色彩大门'
			picurl:"#{config.host}/img/banner-7.jpg"
			url: "#{config.host}/art/6"
		}
	]
	
}
jianxingpin = {
	name:"鉴星品"
	key:"1"
	type:"news"
	items:[
		{
			title:"Samsung GALAXY Tab S Super AMOLED 炫丽屏重新定义视界"
			description: 'Samsung GALAXY Tab S Super AMOLED 炫丽屏重新定义视界'
			picurl:"#{config.host}/img/banner-11.jpg"
			url: "#{config.host}/art/11"
		}
		{
			title:"Samsung GALAXY Tab S 最好的多媒体平板"
			description: 'Samsung GALAXY Tab S 最好的多媒体平板'
			picurl:"#{config.host}/img/banner-12.jpg"
			url: "#{config.host}/art/12"
		}
		{
			title:"Samsung GALAXY K zoom 让每个瞬间都精彩"
			description: 'Samsung GALAXY K zoom 让每个瞬间都精彩'
			picurl:"#{config.host}/img/banner-13.jpg"
			url: "#{config.host}/art/13"
		}
		{
			title:"三星GALAXY S5 专享4G应用"
			description: '三星GALAXY S5 专享4G应用'
			picurl:"#{config.host}/img/banner-14.jpg"
			url: "#{config.host}/art/14"
		}
	]
	
}
magazine = {
	name:"看杂志"
	key:"1"
	type:"news"
	items: [
		{
			title:"新炫刊，汇聚海量精品杂志，畅爽的交互体验，带来全新视觉盛宴。"
			description: '新炫刊，汇聚海量精品杂志，畅爽的交互体验，带来全新视觉盛宴。'
			picurl:"#{config.host}/img/banner-15.jpg"
			url: "#{config.host}/art/15"
		}
		{
			title:"华夏地理——多角度深度探索世界，为您带来世界变迁的精彩内容"
			description: '华夏地理——多角度深度探索世界，为您带来世界变迁的精彩内容'
			picurl:"#{config.host}/img/banner-16.jpg"
			url: "#{config.host}/art/16"
		}
		{
			title:"新潮电子——领导数码时尚新生活"
			description: '新潮电子——领导数码时尚新生活'
			picurl:"#{config.host}/img/banner-17.jpg"
			url: "#{config.host}/art/17"
		}
		{
			title:"时尚旅游——独特视角带你探索世界"
			description: '时尚旅游——独特视角带你探索世界'
			picurl:"#{config.host}/img/banner-18.jpg"
			url: "#{config.host}/art/18"
		}
	]
}
my = {
	name:"查积分"
	key:"1"
	type:"news"
	items: [
		{
			title:"积分信息查询"
			description: '您的积分是:{jl}积分,点击<阅读全文>查看详细信息.'
			picurl:"#{config.host}/img/banner-15.jpg"
			url: "#{config.host}/middle?openid={openid}&url=/sign/my"
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
	else if message.EventKey is "my"
		newmy = my
		newmy.url = newmy.url.replace "{openid}",message.FromUserName
		User.getUserOpenId message.FromUserName,(err,user)->
			if user?
				Inte.getInteAll user._id,(err,count)->
					newmy.description = newmy.description.replace "{jf}",count
					callback newmy
			else
				newmy.description = newmy.description.replace "{jf}","0"
				callback newmy
	else
		callback empty

	# callback welcometext