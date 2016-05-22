var $ = require('zepto');
var Ajax = require('common/ajax/index');
var LoginPop = require('common/login-pop/index');
var Alert = require('common/alert/alert');
var Bubble = require('common/bubble/bubble');

var ticketTmpl = __inline('ticket.tmpl'); //优惠券
var redTmpl = __inline('red.tmpl'); //优惠券

init();

function init() {
	addEvent();
	isLogin();
}

function addEvent() {
	$('#J-award-btn').on('click', getAward);
}

/**
 * 判断用户是否登陆
 * @return {Boolean} [description]
 */
function isLogin() {
	if ($(document.body).attr('is-login') == 0) {
		LoginPop.show({
			Ajax: Ajax,
			manualClose: false,
			loginSuc: function() {
				location.reload();
			}
		});
	}
}

/**
 * 抽奖
 * @return {[type]} [description]
 */
function getAward() {
	new Ajax().send({
		url: '/Activity/LotteryRedPackage/doLottery'
	}, function(result) {
		alertAward(result.type, {
			price: result.content
		});
	});
}



/**
 * 弹出奖励
 * @param  {[type]} type [description]
 * @return {[type]}      [description]
 */
function alertAward(type, data) {
	var html;

	switch (type) {
		case 1: //优惠券
			html = ticketTmpl(data);
			break;
		case 2: //红包
			html = redTmpl(data);
			break;
	}

	Alert.show(html, false, 'redpackage-alert');
}