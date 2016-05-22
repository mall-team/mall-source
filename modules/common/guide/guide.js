var $ = require('zepto');

function Guide(btn, type, text) {
	this.$btn = $(btn);
	this.type = type;
	this.text = text;

	this._init();
}

Guide.prototype = {
	_tmpl: __inline('guide.tmpl'),
	_init: function() {
		var self = this;

		self.$btn.on('click', function() {
			self.show();
		});


	},

	show: function() {
		var self = this;

		$(document.body).append(self._tmpl({
			type: self.type,
			text: self.text
		}));
		// location.hash = "#guide";
		// setTimeout(function(){
		// 	window.onhashchange = function() {
		// 		self._close();
		// 	};
		// });

		$('#J-guide').on('click', function() {
			self._close();
		});
	},
	_close: function() {
		$('#J-guide').off('click').remove();
		// window.onhashchange = null;
		// location.hash = "";
	}
};

module.exports = Guide;