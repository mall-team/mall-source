var EVENT_TAP = 'click';
var $ = require('zepto');


function Amount(el) {
	this.$el = el ? $(el) : $('.J-amount-bar');
	if (this.$el.length > 1) {
		this.$el = $($el[0]);
	}
	this.$minus = this.$el.find('.btn-minus');
	this.$add = this.$el.find('.btn-add');
	this.$val = this.$el.find('.amount-val');

	this._timer = null; //控制请求发送频率timer
}

Amount.prototype = {
	resetBtn: function() {
		this._resetBtn();
	},
	init: function(ajaxUpdate) {
		var self = this;

		self.ajaxUpdate = ajaxUpdate;

		var $el = self.$el;
		var $minus = self.$minus;
		var $add = self.$add;
		var $val = self.$val;

		self._resetBtn();
		$minus.on(EVENT_TAP, function() {
			var min = $el.attr('min');
			var v = +$val.text();

			v = v - 1;

			if (min !== null && v < +min) {
				return;
			}

			$val.text(v);
			self._resetBtn();

			self._ajax(v);
			return false;
		});
		$add.on(EVENT_TAP, function() {
			var max = $el.attr('max');
			var v = +$val.text();

			v = v + 1;

			if (max !== null && v > +max) {
				return;
			}
			$val.text(v);
			self._resetBtn();

			self._ajax(v);
			return false;
		});
	},
	_ajax: function(v) {
		var self = this;
		var ajaxUpdate = self.ajaxUpdate;

		if (ajaxUpdate) {
			if (self._timer) {
				clearTimeout(self._timer);
			}
			self._timer = setTimeout(function(){
				ajaxUpdate(v, self.$el);
			}, 500);
		}
	},
	_resetBtn: function() {
		var $el = this.$el;
		var $minus = this.$minus;
		var $add = this.$add;
		var $val = this.$val;
		var min = $el.attr('min');
		var max = $el.attr('max');
		var val = +$val.text();

		if (min != null && val <= min) {
			$minus.addClass('disabled');
		} else {
			$minus.removeClass('disabled');
		}
		if (max != null && val >= max) {
			$add.addClass('disabled');
		} else {
			$add.removeClass('disabled');
		}
	}
};

// function init() {
// 	$('.J-amount-bar').each(function(idx, el) {
// 		var $el = $(el);
// 		var $minus = $el.find('.btn-minus');
// 		var $add = $el.find('.btn-add');
// 		var $val = $el.find('.amount-val');

// 		resetBtn();

// 		$minus.on(EVENT_TAP, function() {
// 			var min = $el.attr('min');
// 			var v = +$val.text();

// 			v = v - 1;

// 			if (min !== null && v < +min) {
// 				return;
// 			}
// 			$val.text(v);
// 			resetBtn();
// 		});
// 		$add.on(EVENT_TAP, function() {
// 			var max = $el.attr('max');
// 			var v = +$val.text();

// 			v = v + 1;

// 			if (max !== null && v > +max) {
// 				return;
// 			}
// 			$val.text(v);
// 			resetBtn();
// 		});

// 		function resetBtn() {
// 			var min = $el.attr('min');
// 			var max = $el.attr('max');
// 			var val = +$val.text();

// 			if (min != null && val <= min) {
// 				$minus.addClass('disabled');
// 			} else {
// 				$minus.removeClass('disabled');
// 			}
// 			if (max != null && val >= max) {
// 				$add.addClass('disabled');
// 			} else {
// 				$add.removeClass('disabled');
// 			}
// 		}

// 	});
// }

module.exports = Amount;