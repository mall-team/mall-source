var $ = require('zepto');
var Pop = require('common/pop/index');
var Address = require('common/address/index');
var Ajax = require('common/ajax/index');
var Timer = require('common/timer/timer');

var payTmpl = __inline('pays.tmpl');

var totalVal = (+$('#J-total-val').val() + (+$('#J-trans-val').val())).toFixed(2); //消费金额 + 运费
var lastVal = +$('#J-last-val').val(); //帐户余额

var $moneyLast = $('#J-money-last');
var $minusContent = $('#J-minus-content'); //减去余额text
var $lastPay = $('#J-last-pay'); //还需支付
var $lastPayLabel = $('#J-last-text'); //还需支付文案

var $useLastInput = $('#J-use-last'); //是否使用余额
var $payTypeInput = $('#J-pay-type'); //支付类型
var $needPayInput = $('#J-need-pay'); //还需支付

var $payBtn = $('.J-pay-btn');
var $address = $('#J-address');

function init() {
	new Timer('#J-wait-timer', function(time) {
		var minute = parseInt(time / 60, 10);
		var sec = time - minute * 60;
		return Timer.addZero(minute) + ':' + Timer.addZero(sec);
	}).start();

	initLastMoney();
	addEvent();

	// if ($address.hasClass('no-address')) {
	// 	showAddr();
	// }
}

function addEvent() {
	$address.on('click', showAddr);

	$('#J-pay-other').on('click', function() {

		Pop.show({
			content: payTmpl(),
			hasClose: false
		});
		$payBtn = $('.J-pay-btn');

		$payBtn.off('click', toPay);
		$payBtn.on('click', toPay);
	});

	$payBtn.on('click', toPay);

}

function showAddr() {
	Address.show({
		selected: function(item) {
			if (item) {
				$address.find('.user-name').text(item.recipient_name);
				$address.find('.tel').text(item.recipient_phone);
				$address.find('.addr-addr').text(item.province_name + item.city_name + item.region_name + item.recipient_address);
				$address.removeClass('no-address');
				$('#J-addr-id').val(item.id);
			} else {
				$('#J-address').addClass('no-address');
			}
		}
	});
}

var wxPayData;
var wxLoading = false;

function toPay() {
	var $curBtn = $(this);
	var $form = $('#J-pay-form');
	var type = $curBtn.attr('type');

	$payTypeInput.val(type);
	// Pop.hide();

	new Ajax().send({
		url: $form.attr('action'),
		data: $form.serialize(),
		type: $form.attr('method')
	}, function(result) {
		var orderId = result.orderId;
		
		if (orderId) {
			$('#J-order-id').val(orderId);
		}
		if (result.wxPayParams) { //微信支付
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
		'getBrandWCPayRequest', JSON.parse(wxPayData.wxPayParams),
		function(res) {
			wxLoading = false;
			$('.J-pay-btn.btnl-wx').removeClass('loading').text('微信安全支付');

			WeixinJSBridge.log(res.err_msg);
			if (res.err_msg == "get_brand_wcpay_request:ok") {
				setTimeout(function() {
					location.href = wxPayData.wxPaySucUrl;
				}, 500)
			} else {
				if (res.err_msg != "get_brand_wcpay_request:cancel") {
					alert(res.err_code + " " + res.err_desc);
				}
			}
		}
	);
}


function initLastMoney() {

	$minusContent.find('.price b').text(Math.min(lastVal, totalVal));
	$minusContent.css('display', 'none');
	$lastPay.text(totalVal);
	$needPayInput.val(totalVal);

	if (lastVal == 0) {
		$moneyLast.addClass('disabled');
	} else {
		$moneyLast.addClass('usable').on('click', function() {
			var $cur = $(this);
			var payNum = ((+totalVal) - lastVal).toFixed(2);

			if (payNum < 0) {
				payNum = 0;
			}


			if ($cur.hasClass('selected')) { //不用余额
				$cur.removeClass('selected');
				$useLastInput.val(0);
				$minusContent.css('display', 'none');
				$lastPay.text(totalVal);
				$needPayInput.val(totalVal);

				$('footer').removeClass('use-yue');
			} else { //使用余额
				$cur.addClass('selected');
				$useLastInput.val(1);
				$needPayInput.val(payNum);


				if (totalVal <= lastVal) { //余额够用
					$('footer').addClass('use-yue');
				} else { //余额不够用
					$minusContent.css('display', 'inline');
					$lastPay.text(payNum);
					$lastPayLabel.text('还需支付');

					$('footer').removeClass('use-yue');
				}
			}


		});

	}
}

init();