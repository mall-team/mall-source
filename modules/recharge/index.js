var $ = require('zepto');
var Ajax = require('common/ajax/index');
var Bubble = require('common/bubble/bubble');

var $payBtn = $('.J-pay-btn');
var $payTypeInput = $('#J-pay-type'); //支付类型

var wxPayData;
var wxLoading = false;

init();

function init() {
	addEvent();
}

function addEvent() {
	$payBtn.on('click', toPay);
	$('#J-cz-input').on('input', validateMoney);
}

function validateMoney() {
	var $input = $(this);
	var val = $input.val();
	var arr = val.match(/\d+/);

	if (arr) {
		val = +arr[0];

		if (val <= 0) {
			$input.val('');
		// } else if (val > 99999) {
		// 	$input.val(99999);
		} else {
			$input.val(val);
		}
	} else {
		$input.val('');
	}
}


function toPay() {
	var czVal = $('#J-cz-input').val();

	if (!czVal) {
		Bubble.show('请输入充值金额！');
		return;
	} else if ((+czVal) > 99999) {
		Bubble.show('您的充值金额太大，充值金额不能超过5位数');
		return;
	}

	var $curBtn = $(this);
	var $form = $('#J-pay-form');
	var type = $curBtn.attr('type');

	$payTypeInput.val(type);

	new Ajax().send({
		url: $form.attr('action'),
		data: $form.serialize(),
		type: $form.attr('method')
	}, function(result) {
		var orderId = result.orderId;

		if (orderId) {
			$('#J-order-id').val(orderId);
		}
		if (result.wxPayParams || result.jsParams) { //微信支付
			if (wxLoading) {
				return false;
			}
			wxLoading = true;
			$('.J-pay-btn.btnl-wx').addClass('loading').text('正在努力加载，请稍候...');

			wxPayData = result;
			wxPay();
		}
	}, function(data) {
		var orderId = data.result.orderId;
		if (orderId) {
			$('#J-order-id').val(orderId);
		}
	});
	return false;
}

/**
 * 微信支付
 */
function wxPay() {
	if (typeof WeixinJSBridge == "undefined") {
		if (document.addEventListener) {
			document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
		} else if (document.attachEvent) {
			document.attachEvent('WeixinJSBridgeReady', jsApiCall);
			document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
		}
	} else {
		jsApiCall();
	}
}

/**
 * 调用微信支付接口
 */
function jsApiCall() {
	WeixinJSBridge.invoke(
		'getBrandWCPayRequest', JSON.parse(wxPayData.wxPayParams || wxPayData.jsParams),
		function(res) {
			wxLoading = false;
			$('.J-pay-btn.btnl-wx').removeClass('loading').text('微信安全支付');

			WeixinJSBridge.log(res.err_msg);
			if (res.err_msg == "get_brand_wcpay_request:ok") {
				setTimeout(function() {
					location.href = wxPayData.wxPaySucUrl || wxPayData.url;
				}, 500)
			} else {
				if (res.err_msg != "get_brand_wcpay_request:cancel") {
					alert(res.err_code + " " + res.err_desc);
				}
			}
		}
	);
}