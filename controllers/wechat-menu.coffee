# 根据菜单参数跳转或返回对应数据.

newactive = -> return {
	name:"新活动"
	key:"1"
	type:"news"
	items:[
		{
			title:"关注三星乐园微信公众账号,惊喜大礼等你拿!"
			description: '关注三星乐园微信公众账号,惊喜大礼等你拿!'
			picurl:"#{config.host}/img/banner-1.jpg"
			url: "#{config.host}/page1"
		}
		{
			title:"GALAXY K zoom让每个瞬间都精彩!"
			description: 'GALAXY K zoom让每个瞬间都精彩!'
			picurl:"https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzPrkjqVuXnZk7kv2dM1ed7uuJ11IicjPwfuicc6tmAVhrLyolJTe2oThaatNbInYZBdmBAlJMWfrZqw/0"
			url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200501036&idx=1&sn=7c19d06ff08719359639336eb357bbfe#rd"
		}
		{
			title:"参与今日话题#你敢不敢说走就走#赢取迪士尼小玩偶"
			description: '参与今日话题#你敢不敢说走就走#赢取迪士尼小玩偶'
			picurl:"#{config.host}/img/banner-10.jpg"
			url: "#{config.host}/middle/{openid}?url=/sign/topic"
		}
	]
}

oversite = -> return {
	name:"临·现场"
	key:"1"
	type:"news"
	items:[
		{
			title:"重新定义“视”界 三星 GALAXY Tab S 开启色彩大门"
			description: '【2014 年 7 月 7 日，上海】三星电子于上海世博创意秀场正式推出旗下迄今最轻薄的平板电脑 GALAXY Tab S，为中国消费者揭开了这款万众期待的平板电脑的神秘面纱。'
			picurl:"https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzO0MI2JicM7fHVaiaQeTniaYBHfExcwyqI7M2wbuPcJwiaKmWASIhFeNMc9jLy5p0xevNicFme4oeic1lZg/0"
			url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200559799&idx=1&sn=9f9276bef86f5fa505897df138559a31#rd"
		}
	]
	
}
jianxingpin = -> return {
	name:"鉴星品"
	key:"1"
	type:"news"
	items:[
		{
			title:"Samsung GALAXY Tab S Super AMOLED 炫丽屏重新定义视界"
			description: 'Samsung GALAXY Tab S Super AMOLED 炫丽屏重新定义视界'
			picurl:"https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzO0MI2JicM7fHVaiaQeTniaYBH9RQ1iaJH9XK6iatFxjdE8WQ8qFqEZ2MOz89T8ZcBBLJP9gIzH9pTbpeQ/0"
			url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200559196&idx=1&sn=65df46c2bf8f852d815d3bb887c96ee2#rd"
		}
		{
			title:"Super AMOLED 介绍"
			description: 'Super AMOLED 介绍'
			picurl:"https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzO0MI2JicM7fHVaiaQeTniaYBHRQObuicHPsbAsdZxcVuoqNiatI3jCoVOmiaqtYGV0ObgL4KESxVmnk6Qw/0"
			url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200559196&idx=2&sn=e63c12ed63c62ade95295f7f04570a01#rd"
		}
		{
			title:"Samsung GALAXY K zoom 让每个瞬间都精彩"
			description: 'Samsung GALAXY K zoom 让每个瞬间都精彩'
			picurl:"https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzO0MI2JicM7fHVaiaQeTniaYBH6fTuuEtLsy7fGvZsBflV9SOpY5iacHiaDd056ZA3aq8HGPxEzzpEq5aw/0"
			url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200559196&idx=3&sn=a3cefce3da85b400072a9303de8be9e4#rd"
		}
		{
			title:"Samsung GALAXY S5 专享4G应用"
			description: 'Samsung GALAXY S5 专享4G应用'
			picurl:"https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzO0MI2JicM7fHVaiaQeTniaYBHhMDv4OicBJTCVnhTfSa0g6UPAick0MFVfBr86PtDVe9akcS844s3YYJQ/0"
			url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200559196&idx=4&sn=84820a9612c169b067729da25596adfe#rd"
		}
	]
	
}
magazine = -> return {
	name:"看杂志"
	key:"1"
	type:"news"
	items: [
		{
			title:"新炫刊，汇聚海量竞品杂志，畅爽的交互体验，带来全新视觉盛宴。"
			description: '新炫刊，汇聚海量竞品杂志，畅爽的交互体验，带来全新视觉盛宴。'
			picurl:"https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzO0MI2JicM7fHVaiaQeTniaYBHvpxEibG6M8wCIKGg6xXqicV91GaJLzia2ZyYzEOMCB3FrRY2xMJfyicsCA/0"
			url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200559296&idx=1&sn=15090e2e6a8708a6cf9e5373dcf061a8#rd"
		}
		{
			title:"华夏地理——多角度深度探索世界，为您带来世界变迁的精彩内容"
			description: '华夏地理——多角度深度探索世界，为您带来世界变迁的精彩内容'
			picurl:"https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzO0MI2JicM7fHVaiaQeTniaYBHBpYE54co69qNgDkSTVDHQC8nibVMkuHs4YltD35weSZiacFiaOZUx7j5g/0"
			url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200559296&idx=2&sn=b050f7dfe3e5aab18f1a667413318631#rd"
		}
		{
			title:"新潮电子——领导数码时尚新生活"
			description: '新潮电子——领导数码时尚新生活'
			picurl:"https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzO0MI2JicM7fHVaiaQeTniaYBHbsbXMN7icbWrS4Lx4HibQFUHBIwGITAc0gviaaIqUkFKUodMfqH1m4BfA/0"
			url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200559296&idx=3&sn=357c8eb2b5550bd4d9cac3fc3c284f8e#rd"
		}
		{
			title:"时尚旅游——独特视角带你探索世界"
			description: '时尚旅游——独特视角带你探索世界'
			picurl:"https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzO0MI2JicM7fHVaiaQeTniaYBHjOCk70AwCCtECVibxCBoDubvOqSb2AzIQTryMoibenibZMdJ7H1BTKq3g/0"
			url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200559296&idx=4&sn=2581fb570a19e435c6b35050598a9444#rd"
		}
	]
}
my = -> return {
	name:"查积分"
	key:"1"
	type:"news"
	items: [
		{
			title:"积分信息查询"
			description: '您的积分是:{jf}积分,点击《阅读全文》查看详细信息. [请勿转发此条信息,包含您的个人信息]'
			picurl:"#{config.host}/img/banner-into.jpg"
			url: "#{config.host}/middle/{openid}?url=/sign/my"
		}
	]
}
regsinto = -> return {
	name:"来签到"
	key:"1"
	type:"news"
	items: [
		{
			title:"签到获取更多积分"
			description: '您的积分是:{jf}积分,点击《阅读全文》查看详细信息. [请勿转发此条信息,包含您的个人信息]'
			picurl:"#{config.host}/img/banner-qd.jpg"
			url: "#{config.host}/middle/{openid}?url=/page7"
		}
	]
}
topicmenu = -> return {
	name:"聊话题"
	key:"1"
	type:"news"
	items: [
		{
			title:"本期话题:最让你遗憾的事"
			description: '聊话题赢大奖. [请勿转发此条信息,包含您的个人信息]'
			picurl:"#{config.host}/img/banner-topic.jpg"
			url: "#{config.host}/middle/{openid}?url=/sign/topic"
		}
	]
}
luckymenu = -> return {
	name:"试手气"
	key:"1"
	type:"news"
	items: [
		{
			title:"来试试看你的手气,赢大奖"
			description: '摇转轮盘赢大奖. [请勿转发此条信息,包含您的个人信息]'
			picurl:"#{config.host}/img/banner-lucky.jpg"
			url: "#{config.host}/middle/{openid}?url=/sign/lucky"
		}
	]
}
gamemenu = -> return {
	name:"玩游戏"
	key:"1"
	type:"news"
	items: [
		{
			title:"玩热门网游，领豪华礼包！"
			description: '点击玩·游戏，下载玩网游，超级礼包等你来拿!'
			picurl:"#{config.host}/img/banner-20.jpg"
			url: "#{config.host}/middle/{openid}?url=/sign/exchange/1"
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
		callback new oversite()
	else if message.EventKey is "jianxingpin"
		callback new jianxingpin()
	else if message.EventKey is "magazine"
		callback new magazine()
	else if message.EventKey is "newactive"
		callback new newactive()
	else if message.EventKey is "my"
		newmy = new my()
		newmy.items[0].url = newmy.items[0].url.replace "{openid}",message.FromUserName
		User.getUserOpenId message.FromUserName,(err,user)->
			console.log newmy.items[0].url
			if user?
				Inte.getInteAll user._id,(err,count)->
					newmy.items[0].description = newmy.items[0].description.replace "{jf}",count
					callback newmy
			else
				newmy.items[0].description = newmy.items[0].description.replace "{jf}","0"
				callback newmy
	else if message.EventKey is "regsinto"
		newmy = new regsinto()
		newmy.items[0].url = newmy.items[0].url.replace "{openid}",message.FromUserName
		User.getUserOpenId message.FromUserName,(err,user)->
			console.log newmy.items[0].url
			if user?
				Inte.getInteAll user._id,(err,count)->
					newmy.items[0].description = newmy.items[0].description.replace "{jf}",count
					callback newmy
			else
				newmy.items[0].description = newmy.items[0].description.replace "{jf}","0"
				callback newmy
	else if message.EventKey is "topic"
		newmy = new topicmenu()
		newmy.items[0].url = newmy.items[0].url.replace "{openid}",message.FromUserName
		User.getUserOpenId message.FromUserName,(err,user)->
			console.log newmy.items[0].url
			if user?
				Inte.getInteAll user._id,(err,count)->
					callback newmy
			else
				callback newmy
	else if message.EventKey is "lucky"
		newmy = new luckymenu()
		newmy.items[0].url = newmy.items[0].url.replace "{openid}",message.FromUserName
		User.getUserOpenId message.FromUserName,(err,user)->
			console.log newmy.items[0].url
			if user?
				Inte.getInteAll user._id,(err,count)->
					callback newmy
			else
				callback newmy
	else if message.EventKey is "game"
		newmy = new gamemenu()
		newmy.items[0].url = newmy.items[0].url.replace "{openid}",message.FromUserName
		User.getUserOpenId message.FromUserName,(err,user)->
			console.log newmy.items[0].url
			if user?
				Inte.getInteAll user._id,(err,count)->
					callback newmy
			else
				callback newmy
	else
		callback empty

	# callback welcometext