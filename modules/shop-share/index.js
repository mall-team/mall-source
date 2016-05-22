var $ = require('zepto');
var Ajax = require('common/ajax/index');
var Bubble = require('common/bubble/bubble');
var Confirm = require('common/confirm/index');
// var LoginPop = require('common/login-pop/index');

var jumpUrl = $(document.body).attr('jump');

// LoginPop.init({
// 	Ajax: Ajax,
// 	loginSuc: function() {
// 		if (jumpUrl) {
// 			location.href = jumpUrl;
// 		}
// 	}
// });

initLogin({
	loginSuc: function() {
		if (jumpUrl) {
			location.href = jumpUrl;
		}
	}
})

$(document.body).css({
	'min-height': $(window).height()
})



var options;
var disabled = false; //验证按钮是否禁用

var $yzmBt, $submitBt, $phone, $code;

function initLogin(opts) {
	options = opts;
	// Ajax = opts.Ajax;

	$yzmBt = $('#J-yzm-bt');
	$submitBt = $('#J-phone-ok');
	$phone = $('#J-phone');
	$code = $('#J-code');

	$yzmBt.on('click', getCode);
	$submitBt.on('click', login);
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
	var rcode = $('#J-rcode').val();
	if (!phone) {
		Bubble.show('请输入您的手机号码');
		return false;
	} else if (!/^\d{11}$/.test(phone)) {
		Bubble.show('请输入正确的手机号码');
		return false;
	}
	//  else if (!code) {
	// 	Bubble.show('请输入验证码');
	// 	return false;
	// }
	new Ajax().send({
		url: '/User/Register/shareBandAccount',
		type: 'post',
		selfBack: true,
		data: {
			phone: phone,
			code: code,
			rcode: rcode
		}
	}, function(data) {
		var msg = data.msg;

		if (data.code == 0) {
			options.loginSuc && options.loginSuc();
		} else {
			if (msg) {
				Confirm.show({
					msg: msg,
					type: 'alert'
				});
			}
		}
	});
	return false;
}