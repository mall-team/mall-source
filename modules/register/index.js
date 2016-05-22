var $ = require('zepto');
var Bubble = parent.Bubble;
var Ajax = require('common/ajax/index');
var ConfirmService = require('common/confirm-service/index');

var $form = $('#J-form');

var $submitBtn = $('#J-submit-btn'); //提交按钮
var $yzmBtn = $('#J-yzm-btn'); //验证码

var $phone = $('#J-phone');
var $code = $('#J-code');
var $pwd = $('#J-pwd');

var disabled = false; //验证按钮是否禁用

$submitBtn.on('click', formSubmit);
$yzmBtn.on('click', getCode);


/**
 * 提交
 */
function formSubmit() {
	var phone = $phone.val();
	var pwd = $pwd.val();
	var code = $code.val();

	if ($phone.length > 0 && !phone) {
		Bubble.show('请输入您的手机号码');
		return false;
	} else if ($phone.length > 0 && !/^\d{11}$/.test(phone)) {
		Bubble.show('请输入正确的手机号码');
		return false;
	} else if ($pwd.length > 0 && !pwd) {
		Bubble.show('请输入您的密码');
		return false;
	} else if ($code.length > 0 && !code) {
		Bubble.show('请输入验证码');
		return false;
	}

	$phone.length > 0 && $phone.get(0).blur();
	$code.length > 0 && $code.get(0).blur();
	$pwd.length > 0 && $pwd.get(0).blur();

	if ($(document.body).attr('register') == '1') { //注册
		if(!pwd){
			Bubble.show('请输入密码');
			return false;
		}else if(pwd.length < 6){
			Bubble.show('密码长度最小6位')
			return false;
		}

		ConfirmService.start(phone, code, Ajax, function(recommend) {
			if (recommend) {
				$('#J-recommend').val(recommend);
			}
			ajaxSend();
		});
	} else {
		ajaxSend();
	}

	function ajaxSend() {
		new Ajax().send({
			url: $form.attr('action'),
			data: $form.serialize(),
			type: $form.attr('method'),
			selfSucBack: true
		}, function(result, data) {
			var url = data.url;
			var msg = data.msg;
			var jumpTy = result.jump;
			var location = window.location;

			if (jumpTy == 'parent') {
				location = parent.location;
			}
			if (msg) {
				Bubble.show(msg);
				if (url) {
					setTimeout(function() {
						location.href = url;
					}, 3000);
				}
			} else {
				if (url) {
					location.href = url;
				}
			}
			if (!url) {
				parent.Alert.hide();
			}
		}, function(data) {
			if (data.code == 1001) { //注册时，已经注册
				if (data.msg) {
					Bubble.show(data.msg);
				}
				parent.Alert.hide();
				parent.setPhone(phone);
			}
		});
	}
	return false;
}

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
		$yzmBtn.text(curTime).addClass('disabled');
		start();
	});

	function start() {
		setTimeout(function() {
			curTime--;
			$yzmBtn.text(curTime);

			if (curTime <= 0) {
				disabled = false;
				$yzmBtn.text('获取验证码').removeClass('disabled');
				return;
			}
			start();
		}, 1000)
	}
	return false;
}