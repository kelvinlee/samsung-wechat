myProcess = []
getQA = (message,openid,callback)->
	key = message
	console.log "user #{openid} :",myProcess[openid]
	if myProcess[openid]?
		qa = myProcess[openid]
		if qa.next?
			qa = myProcess[openid].next
			qa = searchQA key,qa
			if qa?
				myProcess[openid] = qa if qa.next?
			else
				callback {}
		# if qa.evt?
			# qa.evt openid
			# qa = false
	else
		myProcess[openid] = searchQA key,_qa
		qa = _n = myProcess[openid]

	callback qa

searchQA = (key,list)->
	for a in list
		return a if a.key is key
	return null
clearQA = (openid)->
	console.log "clear: #{openid}"
	delete myProcess[openid]
overQA = (openid,backup = "test")->
	console.log "记录抽奖ID: ",openid
	clearQA openid
	Inser_db_qauser openid,backup
	# Get_db_qauser()





# for question and answer

# _randomBadAnswer = ["本题回答错误。快去本期《我爱三星视频秀》直播仔细瞄一下内容,再来重新作答哦!视频链接: http://tv.sohu.com/samsung","嘿嘿,你一定没有认真看视频,要仔细看才能知道答案哦!~视频链接: http://tv.sohu.com/samsung","哎呀,答错了。只有三道题全对才能赢得S5哟! ~ 视频链接: http://tv.sohu.com/samsung"]

_nr = "\n"
_qa = [
	{
		name:"查看活动详情"
		key:"1"
		type:"news"
		items:[
			{
				backContent :"活动详情"
				title:"Samsung GALAXY K zoom 让每个瞬间都精彩"
				description: '参与活动赢取Samsung GALAXY K zoom，开启你的幸福之旅~'
				picurl:"https://mmbiz.qlogo.cn/mmbiz/icfeQvJeAJzNWR5PaQgtD89x9Drdb3oBEH7YOOcibiajvicowpicTgUjrlNzswycHMGPKjytQvc4icOqb3I627BnkWOQ/0"
				url: "http://mp.weixin.qq.com/s?__biz=MzA5MTUwMzMyNA==&mid=200501036&idx=1&sn=7c19d06ff08719359639336eb357bbfe&scene=1&key=540a4984c4f01b4dfee5b42dd37ecdce5d742de5ce37445e8706c97c1def9f100a8bcf3813e0ea9f10b6acf5efa0d42b&ascene=0&uin=MjY4NjM5MDU%3D"
			}
		]
	} 
]