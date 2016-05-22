// var LoginPop = require('common/login-pop/index');

// LoginPop.init();

var $ = require('zepto');
var Bubble = require('common/bubble/bubble');
var Alert = require('common/alert/alert');
var Ajax = require('common/ajax/index');
var Bubble = require('common/bubble/bubble');
var ConfirmService = require('common/confirm-service/index');

var submitBtn = $('#J-phone-ok');
var $form = $('#J-login-form');
var $yzmBt = $('#J-yzm-bt');
var $phone = $('#J-phone');
var $code = $('#J-code');

window.Bubble = Bubble;
window.Alert = Alert;
window.setPhone = function(phone) {
	$('#J-phone').val(phone);
};
// window.ConfirmService = ConfirmService;

$yzmBt.on('click', getCode);

var disabled = false; //验证按钮是否禁用
/**
 * 获取验证码
 */
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

submitBtn.on('click', function() {
	var phone = $phone.val();
	var code = $code.val();

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

	ConfirmService.start(phone, code, Ajax, function(recommend) {
		if(recommend){
			$('#J-recommend').val(recommend);
		}

		new Ajax().send({
			url: $form.attr('action'),
			data: $form.serialize(),
			type: $form.attr('method')
		}, function() {

		});
	});
	return false;
});

$('[alert]').on('click', function() {
	var $el = $(this);
	var url = $el.attr('alert');

	if (url) {
		Alert.show(url);
	}
	return false;
});