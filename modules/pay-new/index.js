var $ = require('zepto');
var Pop = require('common/pop/index');
var Address = require('common/address/index');
var Ajax = require('common/ajax/index');
var Timer = require('common/timer/timer');
var Util = require('common/util/index');
var Bubble = require('common/bubble/bubble');
var TicketPop = require('common/ticket-pop/index');

var payTmpl = __inline('pays.tmpl');

// var totalVal = (+$('#J-total-val').val() + (+$('#J-trans-val').val())).toFixed(2); //消费金额 + 运费
var totalVal = +$('#J-total-val').val(); //消费金额 + 运费
var lastVal = +$('#J-last-val').val(); //帐户余额

var $moneyLast = $('#J-money-last');
var $minusTicket = $('#J-minus-ticket'); //减去ticket块
var $minusContent = $('#J-minus-content'); //减去余额块
var $lastPay = $('#J-last-pay'); //还需支付
var $lastPayLabel = $('#J-last-text'); //还需支付文案

var $useTicket = $('#J-use-ticket'); //是否使用优惠券
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

	calculateMoney();
	initLastMoney();
	// initLastTaobi();
	addEvent();

	if ($address.hasClass('no-address')) {
		showAddr();
	}
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

	$('#J-ticket-section').on('click', showTicket);

}


function showTicket() {
	var $cur = $(this);
	var $ajaxNode = $('#J-ajaxurl-ticketList')
	var url = $ajaxNode.val();
	var ajaxParams = JSON.parse($ajaxNode.attr('ajaxParams'));

	if ($cur.hasClass('disabled')) {
		return false;
	}
	TicketPop.show({
		curId: $useTicket.val(),
		ajaxUrl: url,
		ajaxParams: ajaxParams,
		orderMoney: totalVal,
		selected: function(ticketItem, total) {
			if (ticketItem == -1) {
				$cur.find('.ticket-num b').text(total);
				$cur.addClass('nouse-ticket');

				$useTicket.val('');
				$minusTicket.css('display', 'none');
			} else {
				$('#J-ticket-price').text(ticketItem.coupon_amount);
				$cur.removeClass('nouse-ticket');

				$useTicket.val(ticketItem.id);
				$minusTicket.find('.price b').text(ticketItem.coupon_amount);
				$minusTicket.css('display', 'inline');
			}
			calculateMoney();
		}
	});

}

/**
 * 显示优惠券列表
 * @return {[type]} [description]
 */
// function showTicket() {
// 	var $cur = $(this);
// 	var cartId = []; //购物车
// 	var ajaxParams = {};

// 	if (!$cur.hasClass('has-ticket')) {
// 		return;
// 	}

// 	$('input[name="cartId[]"]').each(function(i, input) {
// 		cartId.push($(input).val());
// 	});

// 	if (cartId.length > 0) { //购物车结算
// 		ajaxParams.cartId = cartId.join(',');
// 	} else { //单品结算
// 		ajaxParams.productId = $('input[name="productId"]').val();
// 		ajaxParams.num = $('input[name="productNumber"]').val();
// 		ajaxParams.skuValuesText = $('input[name="skuValuesText"]').val();
// 	}

// 	TicketPop.show({
// 		curId: $useTicket.val(),
// 		ajaxParams: ajaxParams,
// 		orderMoney: totalVal,
// 		selected: function(ticketItem, total) {
// 			if (ticketItem == -1) {
// 				$cur.find('.ticket-num b').text(total);
// 				$cur.addClass('nouse-ticket');

// 				$useTicket.val('');
// 				$minusTicket.css('display', 'none');
// 			} else {
// 				$('#J-ticket-price').text(ticketItem.coupon_money);
// 				$cur.removeClass('nouse-ticket');

// 				$useTicket.val(ticketItem.coupon_code);
// 				$minusTicket.find('.price b').text(ticketItem.coupon_money);
// 				$minusTicket.css('display', 'inline');
// 			}
// 			calculateMoney();
// 		}
// 	});
// }

function showAddr() {
	Address.show({
		selected: function(item) {
			if (item && item.recipient_name) {
				//身份证
				if (item.recipient_identity_card) {
					$('#J-idcard').val(item.recipient_identity_card);
				}

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
var curBtnText;

function toPay() {
	var $curBtn = $(this);
	var $form = $('#J-pay-form');
	var type = $curBtn.attr('type');

	var $input = $('#J-idcard'); //身份证号

	if ($input.length > 0) {
		var $warn = $input.parent().find('.icon-warning');
		var val = $input.val();

		if (val.length == 18 && Util.IdCard.valid(val)) {} else {
			if (val === '') {
				Bubble.show('请输入身份证号！');
			} else {
				Bubble.show('身份证号格式错误！');
			}
			window.scroll(0, 0);
			$warn.css('display', 'inline-block');
			return false;
		}
	}

	$payTypeInput.val(type);
	// Pop.hide();

	if (wxLoading) {
		return false;
	}
	wxLoading = true;
	curBtnText = $curBtn.text();
	$curBtn.addClass('disabled').text('正在努力加载，请稍候...');
	// setTimeout(function() {
	// 	wxLoading = false;
	// 	$curBtn.text(curBtnText).removeClass('disabled');
	// }, 5000);
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
			wxPayData = result;
			wxPay();
		}
	}, function(data) {
		wxLoading = false;
		$curBtn.text(curBtnText).removeClass('disabled');

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
			$('.J-pay-btn.btnl-wx').removeClass('disabled').text('微信安全支付');

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


/**
 * 初始化余额
 * @return {[type]} [description]
 */
function initLastMoney() {
	if (lastVal == 0) {
		$moneyLast.addClass('disabled');
	} else {
		$moneyLast.addClass('usable').on('click', function() {
			var $cur = $(this);

			if ($cur.hasClass('selected')) { //不用余额
				$cur.removeClass('selected');
				$useLastInput.val(0);
			} else { //使用余额
				$cur.addClass('selected');
				$useLastInput.val(1);

				//不用淘币
				$('#J-taobi-last').removeClass('selected');
				$('#J-use-taobi').val(0);
			}

			calculateMoney();

		});
	}
}

/**
 * 初始化淘币
 * @return {[type]} [description]
 */
function initLastTaobi() {
	var $tbInput = $('#J-taobi-last-val');
	var $tbLast = $('#J-taobi-last');
	var lastVal = $tbInput.val();

	if (lastVal <= 0) {
		$tbLast.addClass('disabled');
	} else {
		$tbLast.addClass('usable').on('click', function() {
			var $cur = $(this);

			if ($cur.hasClass('selected')) { //不用淘币
				$cur.removeClass('selected');
				$('#J-use-taobi').val(0);
			} else { //使用淘币
				$cur.addClass('selected');
				$('#J-use-taobi').val(1);

				//不用余额
				$('#J-money-last').removeClass('selected');
				$('#J-use-last').val(0);
			}

			calculateMoney();
		});
	}
}


var isInit = true; //是否是初始标识，为了做到初始化时，对还需支付金额不做处理
/**
 * 计算需付多少钱
 * @return {[type]} [description]
 */
function calculateMoney() {
	var isUseLast = $useLastInput.val() != 0; //是否使用余额
	var isUseTicket = !!$useTicket.val(); //是否使用优惠券
	var isUseTaobi = $('#J-use-taobi').val() != 0; //是否使用淘币

	var ticketMoney = +$('#J-ticket-price').text();
	var payNum = totalVal; //还需要支付的钱
	var ticketLastNum = payNum;

	//淘币
	var $minusTaobi = $('#J-minus-taobi');
	var taobiMoney = +$('#J-taobi-last-val').val() || 0;


	if (isUseTicket) {
		ticketLastNum = payNum = (payNum - ticketMoney).toFixed(2);
		$lastPay.text(payNum);
		$minusTicket.find('.price b').text(ticketMoney);
		$minusTicket.css('display', 'inline');
	} else {
		if (!isInit) {
			$lastPay.text(payNum);
		}
		$minusTicket.css('display', 'none');
	}

	// if (isUseTaobi) {
	// 	ticketLastNum = payNum = (payNum - taobiMoney).toFixed(2);
	// 	$minusTaobi.find('.price b').text(taobiMoney);
	// 	$minusTaobi.css('display', 'inline');
	// } else {
	// 	$minusTaobi.css('display', 'none');
	// }

	$minusContent.css('display', 'none');
	$minusTaobi.css('display', 'none');

	if (isUseLast) {

		payNum = (payNum - lastVal).toFixed(2);

		if (payNum <= 0) { //余额够用
			payNum = 0;

			$lastPay.text(ticketLastNum);
			$minusContent.css('display', 'none');
			$lastPayLabel.text('需付');
			$('.btnl-yue').text('余额安全支付');
			$('footer').addClass('use-yue');
		} else {
			$lastPay.text(payNum);
			$minusContent.find('.price b').text(lastVal);
			$minusContent.css('display', 'inline');
			$lastPayLabel.text('还需支付');
			$('footer').removeClass('use-yue');
		}

	} else if (isUseTaobi) {

		payNum = (payNum - taobiMoney).toFixed(2);

		if (payNum <= 0) { //淘币够用
			payNum = 0;

			$lastPay.text(ticketLastNum);
			$minusTaobi.css('display', 'none');
			$lastPayLabel.text('需付');
			$('.btnl-yue').text('淘币安全支付');
			$('footer').addClass('use-yue');
		} else {
			$lastPay.text(payNum);
			$minusTaobi.find('.price b').text(taobiMoney);
			$minusTaobi.css('display', 'inline');
			$lastPayLabel.text('还需支付');
			$('footer').removeClass('use-yue');
		}
	} else {
		$lastPayLabel.text('需付');
		$('footer').removeClass('use-yue');
	}

	isInit = false;

	$needPayInput.val(payNum);
}


/**
 * 身份证验证
 */
(function() {
	var $input = $('#J-idcard');
	var $warn = $input.parent().find('.icon-warning');
	var $suc = $input.parent().find('.icon-suc');

	$input.on('input', function() {
		var val = $input.val();

		if (val.length == 18 && Util.IdCard.valid(val)) {
			$warn.css('display', 'none');
			$suc.css('display', 'inline-block');
		} else {
			$warn.css('display', 'inline-block');
			$suc.css('display', 'none');
		}
	});


})();


init();