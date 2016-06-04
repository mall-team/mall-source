var $ = require('zepto');

function CartAni(img, cart) {
	this.$cart = $(cart);
	this.$img = $(img);
}

CartAni.prototype = {
	fly: function(back) {
		var $img = this.$img;
		var $cart = this.$cart;
		var $imgCloneWrap = $(document.createElement('div'));
		var $imgClone = $img.clone();

		var cartWid = $cart.width();
		var cartHei = $cart.height();

		$imgCloneWrap.on('touchstart', function(evt) { //避免穿透点击
			evt.preventDefault();
			evt.stopPropagation();
		});
		$imgCloneWrap.offset({
			top: $img.offset().top,
			left: $img.offset().left
		}).css({
			'opacity': '1',
			'position': 'absolute',
			'height': $img.height(),
			'width': $img.width(),
			'z-index': '10000'
		}).append($imgClone.css({
			position: 'absolute',
			width: '100%',
			height: '100%',
		})).appendTo($('body'));

		$imgCloneWrap.animate({
			'top': $cart.offset().top + (cartHei - 10) / 2,
			'left': $cart.offset().left + (cartWid - 10) / 2,
			'width': '20px',
			'height': '20px'
		}, 800, 'ease-in-out', function() {
			$imgCloneWrap.remove();
			back && back();
		});

		$imgClone.addClass('animated infinite rotate');

	}
};

module.exports = CartAni;