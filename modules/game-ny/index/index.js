var $ = require('zepto');
var Ajax = require('common/ajax/index');
var Alert = require('common/alert/alert');
var Guide = require('common/guide/guide');
var Confirm = require('common/confirm/index');

init();

function init() {
	addEvent();
	isOver();
}

function addEvent() {
	$(document).on('click', '#J-rule-btn', showRule);
	$(document).on('click', '#J-send-wish', sendWish);
	$(document).on('click', '#J-weal-btn', getWeal);

	new Guide('#J-invite-btn');
}

/**
 * 显示规则
 * @return {[type]} [description]
 */
function showRule(e) {
	e.preventDefault();
	Alert.show(__inline('rule.tmpl')(), true, 'rule-alert');
}

/**
 * 领福利
 * @return {[type]} [description]
 */
function getWeal() {
	if (checkIsAtten()) {
		location.href = "/Activity/NewYearWish/index";
		// new Guide().show();
	}
}

/**
 * 送祝福
 * @return {[type]} [description]
 */
function sendWish() {
	if (!checkIsAtten()) {
		return;
	}
	var $me = $(this);

	new Ajax().send({
		url: '/Activity/NewYearWish/wish',
		data: {
			toOpenId: $('#J-to-id').val()
		}
	}, function(result) {
		Confirm.show({
			msg: result.msg || '祝福成功送出！',
			type: 'alert'
		});
		$me.attr('id', 'J-weal-btn').find('span').text('我也要领福利');
	});

}


/**
 * 检测是否已关注
 * @return {[type]} [description]
 */
function checkIsAtten() {
	var isAtten = $('#J-is-atten').val() == 1;

	if (!isAtten) {
		alertQrcode();
	}
	return isAtten;
}

/**
 * 弹出关注二维码
 * @return {[type]} [description]
 */
function alertQrcode() {
	new Ajax().send({
		url: '/Activity/NewYearWish/getQRCode',
		data: {
			toOpenId: $('#J-to-id').val()
		}
	}, function(result) {

		Alert.show(__inline('qrcode.tmpl')({
			qrcode: result.url
		}), true, 'remind-alert');

	});
}

/**
 * 是否活动结束
 * @return {Boolean} [description]
 */
function isOver() {
	if ($('#J-is-over').val() == 1) { //结束

		Alert.show(__inline('over.tmpl')(), false, 'remind-alert');

	}
}