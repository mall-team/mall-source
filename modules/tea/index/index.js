var $ = require('zepto');
var Ajax = require('common/ajax/index');
var JAjax = require('common/j-ajax/index');
var Guide = require('common/guide/guide');
var Alert = require('common/alert/alert');
var Timer = require('common/timer/timer');
var Util = require('common/util/index');
var JDisabled = require('common/j-disabled/index');
var Amount = require('common/amount/index');
var CommentSection = require('common/comment-section/index');

var EVENT_TAP = 'click';

var amount = new Amount();
var productId = $('#J-product-id').val();
var winHei = $(window).height();
var winScrollY = 0;

//快速登陆相关
var $phoneOk = $('#J-phone-ok2');
var $phone = $('#phone2');
var $code = $('#code2');
var $yzmBt = $('#J-yzm-bt2');


/**
 * 数量 颜色等选择等浮层
 * @type {Object}
 */
var Panel = {
	type: '',
	init: function() {
		var self = this;
		var $panel = $('#J-panel-cm');
		var $close = $panel.find('.close');
		var $mask = $panel.find('.mask');
		var $ok = $panel.find('.J-ok');

		$panel.on('click', function() {
			return false;
		});

		$close.on(EVENT_TAP, function(evt) {
			self.hidden();
			evt.preventDefault();
		});
		$mask.on(EVENT_TAP, function(evt) {
			self.hidden();
			evt.preventDefault();
		});

		$ok.on(EVENT_TAP, function(evt) {
			self.hidden();

			quickBuy();
			evt.preventDefault();
		});

		self._initSel();
	},

	_initSel: function() {
		var self = this;

		self._resetSku();
		amount.init();
		$('#J-cm').delegate('label', EVENT_TAP, function(evt) {
			var $cur = $(evt.target);

			$cur.siblings('label').removeClass('sel');
			$cur.addClass('sel');
			$cur.siblings('input').val($cur.attr('value'));

			self._resetSku();
			amount.resetBtn();
		});

	},

	_resetSku: function() {
		// var sku = search_sku_key();
		// var $bar = $('.J-amount-bar');

		// $('#J-last-num').text(sku.sku_num);

		// if (!$bar.attr('max')) {
		// 	$bar.attr('max', sku.sku_num);
		// }
		// $('#J-sku-price').text(sku.skuPrice);
	},

	show: function(ty) {
		var $cm = $('#J-panel-cm');
		var $mask = $cm.find('.mask');
		var $content = $cm.find('.panel-content');

		this.type = ty;

		// winScrollY = window.scrollY;

		$cm.find('.amount-val').text(1);
		amount.resetBtn();
		$('html').attr('style', 'position: relative; overflow: hidden; height: ' + winHei + 'px;');
		$('body').attr('style', 'overflow: hidden; height: ' + winHei + 'px; padding: 0px;');
		$cm.css('display', 'block');
		$content.animate({
			translateY: '0'
		}, 300, 'ease-out');
	},
	hidden: function() {
		var $cm = $('#J-panel-cm');
		var $mask = $cm.find('.mask');
		var $content = $cm.find('.panel-content');

		$content.animate({
			translateY: '100%'
		}, 300, 'ease-in', function() {
			$('html').attr('style', '');
			$('body').attr('style', '');
			$cm.css('display', 'none');
		});
	}
}

init();

function init() {
	addEvent();
	initPreTimer();
	Panel.init();
	initLogin();

	CommentSection.init({
		id: productId,
		name: $('#J-product-name').val()
	});

	JAjax.init();
	JDisabled.init();
	new Guide('#J-invite-btn', 'guide-tea', '邀请好友来喝茶吧～<br/><i>怎么邀请？你懂得！</i>');


	// if ($(document.body).attr('is-over') == 1) {
	// 	remindOver();
	// }
	// if ($(document.body).attr('has-red') == 1) {
	// 	showRedPacket();
	// }
}

function addEvent() {
	$('.J-remind-btn').on('click', remind); //开抢提醒
	$('#J-play-btn').on('click', playVideo);
	$('.J-btn-buy').on('click', buy);
}

/**
 * 购买
 * @return {[type]} [description]
 */
function buy(evt) {
	Panel.show();
	evt.preventDefault();
}

/**
 * 确认购买
 * @return {[type]} [description]
 */
function quickBuy() {
	var amount = parseInt($('#J-cm-amount').find('.amount-val').text(), 10);
	var $form = $('#J-buy-form');

	$('#J-product-amount').val(amount);

	new Ajax().send({
		url: $form.attr('action'),
		type: $form.attr('method'),
		data: $form.serialize()
	}, function() {});
}


/**
 * 播放video
 * @return {[type]} [description]
 */
function playVideo() {
	$('#J-video-section').html('<div class="video-wrap">\
									<iframe class="video_iframe" src="http://v.qq.com/iframe/player.html?vid=s0175pozzea&amp;auto=1" frameborder="0"></iframe>\
								</div>');

}

/**
 * 显示红包
 */
function showRedPacket(closeBack) {
	Alert.show($('#J-red-package').html(), false, 'alert-red-packet');
	// $('.packet-close').on('click', function() {
	// 	Alert.hide();
	// 	closeBack && closeBack();
	// })
}

/**
 * 结束提醒
 * @return {[type]} [description]
 */
function remindOver() {
	Alert.show($('#J-remind-over').html(), true, 'remind-over');
	new Guide('#J-share-friend');
}

/**
 * 开抢提醒
 * @return {[type]} [description]
 */
function remind() {
	new Ajax().send({
		url: '/Activity/Tea/subscribeQrCode',
		data: {
			pid: Util.getParam('pid'),
			did: Util.getParam('did'),
			recommend: Util.getParam('recommend')
		}
	}, function(result) {

		Alert.show(__inline('remind-alert.tmpl')({
			qrcode: result.url
		}), true, 'remind-alert');

	});
}

/**
 * 初始化预热倒计时
 * @return {[type]} [description]
 */
function initPreTimer() {
	var isPre = $(document.body).hasClass('pre');

	if (!isPre) {
		start();
		return;
	}
	var timer = new Timer('#J-pre-timer', function() {
		var self = this;
		return (self.day > 0 ? (Timer.addZero(self.day) + '天 ') : '') + Timer.addZero(self.hour) + ':' + Timer.addZero(self.min) + ':' + Timer.addZero(self.sec);
	});
	timer.start().end(function() {
		location.reload();
	});
}

/**
 * 启动获取红包数据定时器
 * @return {[type]} [description]
 */
function start() {
	rendSendMoney();
	setTimeout(start, 5000);
}

/**
 * 渲染已发送红包数额
 * @param  {[type]} back [description]
 * @return {[type]}      [description]
 */
function rendSendMoney(back) {
	new Ajax().send({
		url: '/Activity/Tea/alreadySendRedPackage'
	}, function(result) {
		var $money = $('#J-send-money');

		if (result.redPackage != $money.text()) {
			$money.html(result.redPackage).addClass('money-ani');
			setTimeout(function() {
				$('#J-send-money').removeClass('money-ani');
			}, 1000);
		}
		back && back();
	});
}

/**
 * 初始化快速登陆
 * @return {[type]} [description]
 */
function initLogin() {
	var isLogin = $('#J-is-login').val();

	if (isLogin == 0) { //未登陆
		$('#J-panel-cm').addClass('add-phone');
		$yzmBt.on('click', getCode);
		$phoneOk.on('click', login);
	}
}

/**
 * 获取验证码
 */
var disabled = false;

function getCode() {
	if (disabled) {
		return false;
	}

	var phone = $phone.val();
	var curTime = 60;

	new Ajax().send({
		url: '/WeChat/Band/sendMsg',
		data: {
			phone: phone
		}
	}, function() {
		disabled = true;
		$yzmBt.text(curTime).addClass('disabled');
		start();
	});

	function start() {
		setTimeout(function() {
			curTime--;
			$yzmBt.text(curTime);

			if (curTime <= 0) {
				disabled = false;
				$yzmBt.text('获取验证码').removeClass('disabled');
				return;
			}
			start();
		}, 1000)
	}
	return false;
}

/**
 * 验证登陆
 */
function login(evt) {
	var phone = $phone.val();
	var code = $code.val();
	var recommend = Util.getParam('recommend');
	var params;

	if (!phone) {
		Bubble.show('请输入您的手机号码');
		return false;
	} else if (!/^\d{11}$/.test(phone)) {
		Bubble.show('请输入正确的手机号码');
		return false;
	} else if (!code) {
		Bubble.show('请输入验证码');
		return false;
	}
	params = {
		phone: phone,
		code: code
	};
	if (recommend) {
		params.recommend = recommend;
	}
	new Ajax().send({
		url: '/WeChat/Band/bandAccount',
		type: 'post',
		data: params
	}, function() {
		Panel.hidden();

		$('#J-is-login').val(1);
		quickBuy();
		evt.preventDefault();
	});
}