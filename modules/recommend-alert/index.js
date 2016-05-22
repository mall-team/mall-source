var $ = require('zepto');
var Alert = require('common/alert/alert');
var Ajax = require('common/ajax/index');
var Bubble = require('common/bubble/bubble');

var modifyTmpl = __inline('modify.tmpl');
var confirmTmpl = __inline('confirm.tmpl');

var confirmBack,
	noLimit; //没有次数限制
var isShop = false;
var onlyClickHide = false;

/**
 * 修改我的服务人
 * @return {[type]} [description]
 */
function modify(noLimit) {
	Alert.show(modifyTmpl({
		noLimit: noLimit
	}), true, 'recommend-alert');

	var $container = $('.recommend-alert-content');

	$container.find('.J-yes-btn').on('click', function() {
		confirm({
			phone: $container.find('.J-phone').val(),
			noLimit: noLimit
		});
	});

}

/**
 * 确认我的服务人
 * @return {[type]} [description]
 */
function confirm(params) {

	if (params.success) {
		confirmBack = params.success;
	}
	noLimit = params.noLimit;
	isShop = params.isShop;

	if (isShop) {
		onlyClickHide = true;
	}

	if (params.result) {
		confirmAlert(params.result);
		return;
	}

	getRecommendInfo(params.phone, function(result) {

		confirmAlert(result);

	});
}

function confirmAlert(result) {
	Alert.show(confirmTmpl(result), true, 'recommend-alert');

	var $container = $('.recommend-alert-content');

	$container.find('.J-yes-btn').on('click', function() {
		if (onlyClickHide) {
			Alert.hide();
			confirmBack && confirmBack();
		} else {
			modifySubmit($container.find('.phone-label').text());
		}

	});
	$container.find('.modify-link').on('click', modifyAgain);
}

/**
 * 获取推荐人信息
 * @return {[type]} [description]
 */
function getRecommendInfo(phone, back) {
	if (!phone) {
		Bubble.show('请输入手机号码');
		return;
	}
	if (!/^1[3-8]\d{9}$/.test(phone)) {
		Bubble.show('请输入正确手机号码');
		return;
	}

	new Ajax().send({
		url: '/User/Center/getNewServiceInfo',
		type: 'post',
		data: {
			phone: phone
		}
	}, function(result) {
		Alert.hide();
		back && back(result);
	}, function() {
		// Alert.hide();
	});

}

/**
 * 提交修改
 * @param  {[type]} phone [description]
 * @return {[type]}       [description]
 */
function modifySubmit(phone) {
	new Ajax().send({
		url: '/User/Center/changeMyService',
		type: 'post',
		data: {
			phone: phone,
			flag: noLimit ? 1 : 0
		}
	}, function(result) {
		Alert.hide();
		confirmBack && confirmBack();
	});
}

/**
 * 重新修改
 * @return {[type]} [description]
 */
function modifyAgain() {
	onlyClickHide = false;
	Alert.hide();
	modify(noLimit);
}

module.exports = {
	modify: modify,
	confirm: confirm
};