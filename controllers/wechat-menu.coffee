# 根据菜单参数跳转或返回对应数据.

newactive = -> return {
	name:"新活动"
	key:"1"
	type:"news"
	items:[
		{
			title:"关注三星乐园微信公众账号,惊喜大礼等你拿"
			description: '关注三星乐园微信公众账号,惊喜大礼等你拿'
			picurl:"#{config.host}/img/banner-1.jpg"
			url: "#{config.host}/middle/{openid}?url=/page1"
		}
		{
			title:"参与每日话题，赢取精美礼品"
			description: '参与每日话题，赢取精美礼品'
			picurl:"#{config.host}/img/weixin-topic.jpg"
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
			title:"Samsung GALAXY Tab S 炫丽屏重新定义「视」界"
			description: 'Samsung GALAXY Tab S 炫丽屏重新定义「视」界'
			picurl:"https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzO0MI2JicM7fHVaiaQeTniaYBH9RQ1iaJH9XK6iatFxjdE8WQ8qFqEZ2MOz89T8ZcBBLJP9gIzH9pTbpeQ/0"
			url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200559196&idx=1&sn=65df46c2bf8f852d815d3bb887c96ee2#rd"
		}
		{
			title:"Samsung GALAXY Tab S Super AMOLED 介绍"
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
			title:"Samsung GALAXY S Pen 笔随心动，点滴记录"
			description: 'Samsung GALAXY S Pen 笔随心动，点滴记录'
			picurl:"https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzPCniaCMicnMqqz1SFKI2coiaGPFib5A84LCWuIS7LAKlAqE1al4wd4dWoXUlhcbfGBtLq5dJgjQeCCUQ/0"
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
			title:"新潮电子 ︳Samsung GALAXY K zoom 极视界 致手机"
			description: '新潮电子 ︳Samsung GALAXY K zoom 极视界 致手机'
			picurl:"https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzPCniaCMicnMqqz1SFKI2coiaGG6uUDMBE7qiaVlx22cbJ66bDicun4KicAIwnQNVa1vLFcMhViaoqyEbPLQ/0"
			url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200559296&idx=1&sn=15090e2e6a8708a6cf9e5373dcf061a8#rd"
		}
		{
			title:"华夏地理 ︳国宝浙江"
			description: '华夏地理 ︳国宝浙江'
			picurl:"https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzPCniaCMicnMqqz1SFKI2coiaGXeDqDHibykBPPSXHxggTYdKbhOJPj81mkZnSiciahfEESnrIhLQZdtbkg/0"
			url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200559296&idx=2&sn=b050f7dfe3e5aab18f1a667413318631#rd"
		}
		{
			title:"瑞丽服饰美容 ︳戴对表，秒变韩剧女主角"
			description: '瑞丽服饰美容 ︳戴对表，秒变韩剧女主角'
			picurl:"https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzPCniaCMicnMqqz1SFKI2coiaGHS2qliaoQ2yDM8jvVggzoWSmaTor6FJvJLfviahUzrnvnoAFtomNSSNA/0"
			url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200559296&idx=3&sn=357c8eb2b5550bd4d9cac3fc3c284f8e#rd"
		}
		{
			title:"时尚芭莎 ︳Angelababy 活得开心 做到最好"
			description: '时尚芭莎 ︳Angelababy 活得开心 做到最好'
			picurl:"https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzPCniaCMicnMqqz1SFKI2coiaGbeZ5fIhQV8m9Lw712mtOYb01aden2Vsa7Jr9FmtpDnPpHp0zcjKsug/0"
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
			title:"参与每日话题，赢取精美礼品"
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
videos = -> return {
	name:"观视频"
	key:"1"
	type:"news"
	items: [
		{
			title:"搜狐视频独播《巡夜人日志》第一集创韩国月火剧收视冠军！"
			description: '搜狐视频独播《巡夜人日志》第一集创韩国月火剧收视冠军！'
			picurl:"https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzPCniaCMicnMqqz1SFKI2coiaGOK1oLv8AmxicppGDsiatrJ1dP2t7VECcfwotwNthMUzysywXVckjmfrg/0"
			url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=201179385&idx=1&sn=1e5ec46885ceabc0531703b442f0cce7#rd"
		}
		{
			title:"《我爱三星视频秀》54期：GALAXY Tab S 绚丽世界中的精彩应用"
			description: '《我爱三星视频秀》54期：GALAXY Tab S 绚丽世界中的精彩应用'
			picurl:"https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzPCniaCMicnMqqz1SFKI2coiaGqziaptWvH56GQd7HSR6MENCo9XD8YX37qKIjQAf4CND7xaicicjBiam0xA/0"
			url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=201179385&idx=2&sn=350a13b6b1aabb9a27a7911309a73111#rd"
		}
		{
			title:"《Jessica&Krystal》收官，闪瞎综艺档收视率！"
			description: '《Jessica&Krystal》收官，闪瞎综艺档收视率！'
			picurl:"https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzPCniaCMicnMqqz1SFKI2coiaGv3CLYhYoyKuKNkdR1dsm176WaXIR4zFbN5k2gMp7j3hlb4PDzlyULQ/0"
			url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=201179385&idx=3&sn=ce36d8402e61e53e5267fe02997b2f13#rd"
		} 
		{
			title:"搜狐入股金秀贤所属公司Keyeast 成第二大股东"
			description: '搜狐入股金秀贤所属公司Keyeast 成第二大股东'
			picurl:"https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzPCniaCMicnMqqz1SFKI2coiaGbevib8u2iarKiaj7jcoYQPMYxpUMN3GPmFcNK1UumNBef7y8RejjVWqEw/0"
			url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=201179385&idx=4&sn=2c0626281303dc2a457914ab10761355#rd"
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
		newmy = new newactive()
		newmy.items[0].url = newmy.items[0].url.replace "{openid}",message.FromUserName
		# newmy.items[2].url = newmy.items[2].url.replace "{openid}",message.FromUserName
		User.getUserOpenId message.FromUserName,(err,user)->
			# console.log newmy.items[2].url
			if user?
				Inte.getInteAll user._id,(err,count)->
					# newmy.items[2].description = newmy.items[2].description.replace "{jf}",count
					callback newmy
			else
				# newmy.items[2].description = newmy.items[2].description.replace "{jf}","0"
				callback newmy
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
	else if message.EventKey is "videos"
		newmy = new videos()
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