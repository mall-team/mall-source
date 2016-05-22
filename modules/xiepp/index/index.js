var $ = require('zepto');
require('extend/lazyload');
var Ajax = require('common/ajax/index');
var JAjax = require('common/j-ajax/index');
var Guide = require('common/guide/guide');
var Alert = require('common/alert/alert');
var Timer = require('common/timer/timer');
var Util = require('common/util/index');
var JDisabled = require('common/j-disabled/index');
var CommentSection = require('common/comment-section/index');

var productId = $('#J-product-id').val();

init();

function init() {
	addEvent();
	initPreTimer();

	CommentSection.init({
		id: productId,
		name: $('#J-product-name').val()
	});

	JAjax.init();
	JDisabled.init();
	lazyLoadImg();
}

function addEvent() {
	$('.J-remind-btn').on('click', remind); //开抢提醒
	$('#J-rule-btn').on('click', function() {
		Alert.show(__inline('rule.tmpl')(), true, 'rule-alert');
	});
}

function lazyLoadImg() {
	$("[data-original]").lazyload({
		placeholderClass: 'placeholder',
		effect: 'fadeIn',
		threshold: 500
	});
}

/**
 * 开抢提醒
 * @return {[type]} [description]
 */
var reminding = false;

function remind() {

	if (reminding) {
		return false;
	}

	reminding = true;

	new Ajax().send({
		url: '/Activity/Crab/subscribeQrCode',
		data: {
			recommend: Util.getParam('recommend')
		}
	}, function(result) {

		Alert.show(__inline('remind-alert.tmpl')({
			qrcode: result.url,
			startTime: result.startTime
		}), true, 'remind-over', function() {
			reminding = false;
		});

	}, function() {
		reminding = false;
	});
}

/**
 * 初始化预热倒计时
 * @return {[type]} [description]
 */
function initPreTimer() {
	var $preTimer = $('#J-pre-timer');
	var timer;

	if (!$preTimer[0]) {
		return;
	}

	timer = new Timer($preTimer, function() {
		var self = this;
		return (self.day > 0 ? (Timer.addZero(self.day) + '天 ') : '') + Timer.addZero(self.hour) + '小时' + Timer.addZero(self.min) + '分钟' + Timer.addZero(self.sec) + '秒';
	});
	timer.start().end(function() {
		location.reload();
	});
}