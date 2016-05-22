var touser;
var $ = require('zepto');
var Ajax = require('common/ajax/index');

var token = $('#J-token').val();
var isFir = true;

try {
	touser = location.search.match(/touser=([^&]+)/)[1];
} catch (e) {}

Date.prototype.format = function(format) {
	var o = {
		"M+": this.getMonth() + 1, //month
		"d+": this.getDate(), //day
		"h+": this.getHours(), //hour
		"m+": this.getMinutes(), //minute
		"s+": this.getSeconds(), //second
		"q+": Math.floor((this.getMonth() + 3) / 3), //quarter
		"S": this.getMilliseconds() //millisecond
	}
	if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(format))
			format = format.replace(RegExp.$1,
				RegExp.$1.length == 1 ? o[k] :
				("00" + o[k]).substr(("" + o[k]).length));
	return format;
}

init();

function init() {
	addEvent();
	start();
}

function addEvent() {
	$('#J-send').on('click', sendMsg);
}

function sendMsg() {
	var val = $('#J-msg').val();

	if(!val){
		return;
	}
	new Ajax().send({
		type: 'post',
		url: '/User/Customer/singleMsg',
		data: JSON.stringify({
			touser: touser,
			msgtype: "text",
			token: token,
			text: {
				content: val
			}
		})
	}, function(data) {
		$('#J-msg').val('');
		getMsgList();
	}, function(data) {
		addMsg(data.msg, 'error');
	});
}

function start() {
	getMsgList();

	setTimeout(function() {
		start();
	}, 3000)
}

function getMsgList() {
	var url = '/User/Customer/pullMsg';

	if (isFir) {
		url = '/User/Customer/recentMsg';
		isFir = false;
	}
	new Ajax().send({
		type: 'get',
		url: url,
		data: {
			uid: touser,
			token: token
		},
		selfErrorBack: true
	}, function(result) {
		addMsg(result);
	}, function(data) {
		if (data && data.msg) {
			addMsg(data.msg, 'error');
		}
	});
}

function addMsg(data, type) {
	var tmpl = '';
	var myOpenId, list;

	type = type || 'msg';

	switch (type) {
		case 'msg':
			myOpenId = data['uid'];
			list = data.list;

			$.each(list, function(i, item) {
				if(item.msgtype == 'notice'){
					tmpl += '<p class="error-msg"><span>' + item.notice.content + '</span></p>';
				}else{
					tmpl += '<div class="chart-item ' + (item.uid == myOpenId ? 'myself' : '') + '">\
								<div class="chart-inner clearfix">\
									<div class="img-wrap" style="background-image: url(' + item.headimgurl + ')"></div>\
									<div class="info-wrap">\
										<p class="nick-wrap"><span class="date">' + new Date(item.time).format('MM-dd hh:mm') + '</span></p>\
										<div class="chart-content">' + item.text.content + '</div>\
									</div>\
								</div>\
							</div>';
				}
			});
			break;
		case 'error':
			tmpl = '<p class="error-msg"><span>' + data + '</span></p>';
			break;
	}

	$('#J-chart-list').append($(tmpl));
	window.scroll(0, 100000);
}