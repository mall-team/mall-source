var $ = require('zepto');
var WxPay = require('common/wxpay/index');
var Ajax = require('common/ajax/index');

init();

function init() {
	addEvent();
}

function addEvent() {
	$('#J-wx-pay').on('click', pay);
}

function pay() {
	new Ajax().send({
		url: '/Mall/Pay/vipDirectPay'
	}, function(result) {
		WxPay.callpay(result.jsParams, result.url);
	});
}