var $ = require('zepto');
var Ajax = require('common/ajax/index');
var Bubble = require('common/bubble/bubble');

init();

function init(){
	addEvent();
}

function addEvent(){
	$('#J-get-coupon').on('click', getCoupon);
}

function getCoupon(){
	new Ajax().send({
		url: '/Activity/CouponRain/drawCoupon'
	}, function(){
		Bubble.show('领取成功！');
		setTimeout(function(){
			location.reload();
		}, 2000)
	});
}