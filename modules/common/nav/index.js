var Ajax = require('common/ajax/index');

/**
 * 初始化购物车
 */
function initCart() {
	new Ajax().send({
		url: $('#J-ajaxurl-initCart').val()
	}, function(result) {
		var num = +result.number;
		// var $cart = $('.cart');
		var $cartNum = $('.cart > .cart-num');

		if (num > 0) {
			$cartNum.text(num).css('display', 'block');
		}
	});
}


module.exports = {
	initCart: initCart
};