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
			title:"关注三星乐园微信公众账号,惊喜大礼等你拿"
			description: '关注三星乐园微信公众账号,惊喜大礼等你拿'
			picurl:"#{config.host}/img/banner-1.jpg"
			url: "#{config.host}/middle/{openid}?url=/page1"
		}
		{
			title:"GALAXY K zoom让每个瞬间都精彩!"
			description: 'GALAXY K zoom让每个瞬间都精彩!'
			picurl:"https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzPrkjqVuXnZk7kv2dM1ed7uuJ11IicjPwfuicc6tmAVhrLyolJTe2oThaatNbInYZBdmBAlJMWfrZqw/0"
			url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200501036&idx=1&sn=7c19d06ff08719359639336eb357bbfe#rd"
		}
		{
			title:"参与每日话题，赢取精美礼品"
			description: '参与每日话题，赢取精美礼品'
			picurl:"#{config.host}/img/banner-10.jpg"
			url: "#{config.host}/middle/{openid}?url=/sign/topic"
		}
	]
}

# 感谢您关注【三星乐园】官方微信，还在向朋友们留言“流量耗尽，下月见”？2014年5月9日—2014年5月22日参与【看名车志，赢车模】活动，就能赢取70M数据流量包、移动30元充值卡~还有精美车模相赠，回复【1】查看“活动详情”，赶紧下载参与吧。奖品有限，参与从速。
plugs_subscribe = (message,callback)->
	newmy = new newactive()
	newmy.items[0].url = newmy.items[0].url.replace "{openid}",message.FromUserName
	newmy.items[2].url = newmy.items[2].url.replace "{openid}",message.FromUserName
	User.getUserOpenId message.FromUserName,(err,user)->
		console.log newmy.items[2].url
		if user?
			Inte.getInteAll user._id,(err,count)->
				newmy.items[2].description = newmy.items[2].description.replace "{jf}",count
				callback newmy
		else
			newmy.items[2].description = newmy.items[2].description.replace "{jf}","0"
			callback newmy
	# callback welcometext