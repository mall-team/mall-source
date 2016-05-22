var $ = require('zepto');
var win = window;

function FixTop(options) {
	this.$el = $(options.el);
	this.pos = this.$el.offset();
	this.gap = 5;

	this.status = 'normal';

	this._init();
}

FixTop.prototype = {

	_init: function() {
		this._addEvent();
	},

	_addEvent: function() {
		var self = this;

		$(window).on('scroll', function() {
			self._scroll();
		});

	},

	_scroll: function() {
		var self = this;
		var scrollY = win.scrollY;
		var sT = scrollY + self.gap;

		// if(self.status == 'fixed'){
		// 	sT = sT + self.$el.height();
		// }

		if (self.pos.top < sT) {
			if(self.status == 'fixed'){
				return;
			}
			self.$el.css({
				'position': 'fixed',
				'z-index': 500,
				'top': 0,
				'width': '100%'
			});
			self.status = 'fixed';
		} else {
			if(self.status == 'normal'){
				return;
			}
			self.$el.css({
				'position': 'static'
			})
			self.status = 'normal';
		}


	}

};



module.exports = FixTop;