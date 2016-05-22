var $ = require('zepto');
var Amount = require('common/amount/index');


function LoginSku() {
	
}

loginSku.prototype = {
	show: function() {

	},

	_init: function() {
		var amount = new Amount();
	}
};

/**
 * 数量 颜色等选择等浮层
 * @type {Object}
 */
// var Panel = {
// 	type: '',
// 	init: function() {
// 		var self = this;
// 		var $panel = $('#J-panel-cm');
// 		var $close = $panel.find('.close');
// 		var $mask = $panel.find('.mask');
// 		var $ok = $panel.find('.J-ok');

// 		$panel.on('click', function() {
// 			return false;
// 		});

// 		$close.on(EVENT_TAP, function(evt) {
// 			self.hidden();
// 			evt.preventDefault();
// 		});
// 		$mask.on(EVENT_TAP, function(evt) {
// 			self.hidden();
// 			evt.preventDefault();
// 		});

// 		$ok.on(EVENT_TAP, function(evt) {
// 			self.hidden();

// 			if (self.type == 'cart') {
// 				addCar();
// 			} else {
// 				quickBuy();
// 			}
// 			evt.preventDefault();
// 		});

// 		// self._hasPhone();
// 		// if (!hasLogin) {
// 		// 	$yzmBt.on('click', getCode);
// 		// 	$phoneOk.on('click', login);
// 		// }
// 		self._initSel();
// 	},

// 	// _hasPhone: function() {

// 	// 	if (hasLogin) {
// 	// 		$('#J-panel-cm').removeClass('add-phone');
// 	// 	} else {
// 	// 		$('#J-panel-cm').addClass('add-phone');
// 	// 	}
// 	// },
// 	_initSel: function() {
// 		var self = this;

// 		self._resetSku();
// 		amount.init();
// 		$('#J-cm').delegate('label', EVENT_TAP, function(evt) {
// 			var $cur = $(evt.target);

// 			$cur.siblings('label').removeClass('sel');
// 			$cur.addClass('sel');
// 			$cur.siblings('input').val($cur.attr('value'));

// 			self._resetSku();
// 			amount.resetBtn();
// 		});

// 	},

// 	_resetSku: function() {
// 		var sku = search_sku_key();
// 		var $bar = $('.J-amount-bar');

// 		$('#J-last-num').text(sku.sku_num);

// 		if (!$bar.attr('max')) {
// 			$bar.attr('max', sku.sku_num);
// 		}
// 		$('#J-sku-price').text(sku.skuPrice);
// 	},

// 	show: function(ty) {
// 		var $cm = $('#J-panel-cm');
// 		var $mask = $cm.find('.mask');
// 		var $content = $cm.find('.panel-content');

// 		this.type = ty;

// 		// winScrollY = window.scrollY;

// 		$cm.find('.amount-val').text(1);
// 		amount.resetBtn();
// 		$('html').attr('style', 'position: relative; overflow: hidden; height: ' + winHei + 'px;');
// 		$('body').attr('style', 'overflow: hidden; height: ' + winHei + 'px; padding: 0px;');
// 		$cm.css('display', 'block');
// 		$content.animate({
// 			translateY: '0'
// 		}, 300, 'ease-out');
// 		// $mask.animate({
// 		// 	opacity: '0.8'
// 		// }, 300, 'ease-out');
// 	},
// 	hidden: function() {
// 		var $cm = $('#J-panel-cm');
// 		var $mask = $cm.find('.mask');
// 		var $content = $cm.find('.panel-content');

// 		$content.animate({
// 			translateY: '100%'
// 		}, 300, 'ease-in', function() {
// 			$('html').attr('style', '');
// 			$('body').attr('style', '');
// 			$cm.css('display', 'none');
// 		});
// 		// $mask.animate({
// 		// 	opacity: 0
// 		// }, 300, 'ease-in', function(){
// 		// 	$('html').attr('style', '');
// 		// 	$('body').attr('style', '');
// 		// 	window.scroll(0, winScrollY);
// 		// });

// 	}
// }


module.exports = LoginSku;