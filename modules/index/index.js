var $ = require('zepto');
require('common/gold/index');
var Swiper = require('common/swiper/index');
// require('common/gotop/index');
var Timer = require('common/timer/timer');
var Ajax = require('common/ajax/index');
var Util = require('common/util/index');

new Swiper({
	container: 'banner',
	pager: 'bannerPager'
});


Util.phpdataReady(function(phpdata){
	if(phpdata.subscribe == 0){
		$('.atten-panel').css('display', 'block');
	}

	$('.J-timer').each(function(i, el) {
		new Timer(el, 'time').start().end(function() {
			// location.reload();
		});
	});
});


/**
 * 初始化购物车
 */
function initCart() {
	new Ajax().send({
		url: $('#J-ajaxurl-initCart').val()
	}, function(result) {
		var num = +result.number;
		var $cart = $('.cart');
		var $cartNum = $('.cart > i');

		if (num > 0) {
			$cart.css('display', 'block');
			$cartNum.text(num);
		}
	});
}

initCart();