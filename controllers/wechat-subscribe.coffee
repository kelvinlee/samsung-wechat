# 欢迎信息页面.
# 此处应该使用数据库.

# welcometext = {
# 	name:"welcome"
# 	key: "你好"
# 	type: "text"
# 	# backContent : "感谢您关注【三星乐园】官⽅方微信,看《我爱三星视频秀》,参与答题,即有机会获得GALAXY S5惊喜大礼!回复【1】了解活动详情,回复【2】开始答题。"
# 	content:"欢迎关注【三星乐园】官⽅微信。参与活动赢取Samsung GALAXY K zoom，还等什么？回复【1】了解活动详情。"
# }
welcometext = {
	name:"新活动"
	key:"1"
	type:"news"
	items:[
		{
			title:"乐园嘉年华，关注赢好礼。您已获得100积分，快去游乐场试手气吧！"
			description: '乐园嘉年华，关注赢好礼。您已获得100积分，快去游乐场试手气吧！'
			picurl:"#{config.host}/img/banner-1.jpg"
			url: "#{config.host}/middle/{openid}?url=/page1"
		}
		{
			title:"Samsung GALAXY Tab 炫丽屏重新定义「视」界"
			description: 'Samsung GALAXY Tab 炫丽屏重新定义「视」界'
			picurl:"https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzO0MI2JicM7fHVaiaQeTniaYBH9RQ1iaJH9XK6iatFxjdE8WQ8qFqEZ2MOz89T8ZcBBLJP9gIzH9pTbpeQ/0"
			url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200559196&idx=1&sn=65df46c2bf8f852d815d3bb887c96ee2#rd"
		}
		{
			title:"新潮电子 ︳Samsung GALAXY K zoom 极视界 致手机"
			description: '新潮电子 ︳Samsung GALAXY K zoom 极视界 致手机'
			picurl:"https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzPCniaCMicnMqqz1SFKI2coiaGG6uUDMBE7qiaVlx22cbJ66bDicun4KicAIwnQNVa1vLFcMhViaoqyEbPLQ/0"
			url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200559296&idx=1&sn=15090e2e6a8708a6cf9e5373dcf061a8#rd"
		}
		{
			title:"搜狐视频独播《巡夜人日志》第一集创韩国月火剧收视冠军！"
			description: '搜狐视频独播《巡夜人日志》第一集创韩国月火剧收视冠军！'
			picurl:"https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzPCniaCMicnMqqz1SFKI2coiaGOK1oLv8AmxicppGDsiatrJ1dP2t7VECcfwotwNthMUzysywXVckjmfrg/0"
			url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=201179385&idx=1&sn=1e5ec46885ceabc0531703b442f0cce7#rd"
		}
	]
}

# 感谢您关注【三星乐园】官方微信，还在向朋友们留言“流量耗尽，下月见”？2014年5月9日—2014年5月22日参与【看名车志，赢车模】活动，就能赢取70M数据流量包、移动30元充值卡~还有精美车模相赠，回复【1】查看“活动详情”，赶紧下载参与吧。奖品有限，参与从速。
plugs_subscribe = (message,callback)->
	newmy = new newactive()
	newmy.items[0].url = newmy.items[0].url.replace "{openid}",message.FromUserName
	callback newmy
	
	# callback welcometext