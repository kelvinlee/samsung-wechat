# 欢迎信息页面.
# 此处应该使用数据库.

welcometext = {
	name:"welcome"
	key: "你好"
	type: "text"
	# backContent : "感谢您关注【三星乐园】官⽅方微信,看《我爱三星视频秀》,参与答题,即有机会获得GALAXY S5惊喜大礼!回复【1】了解活动详情,回复【2】开始答题。"
	content:"欢迎关注【三星乐园】官⽅微信。参与活动赢取Samsung GALAXY K zoom，还等什么？回复【1】了解活动详情。"
}
# 感谢您关注【三星乐园】官方微信，还在向朋友们留言“流量耗尽，下月见”？2014年5月9日—2014年5月22日参与【看名车志，赢车模】活动，就能赢取70M数据流量包、移动30元充值卡~还有精美车模相赠，回复【1】查看“活动详情”，赶紧下载参与吧。奖品有限，参与从速。
plugs_subscribe = (message,callback)->
	callback welcometext