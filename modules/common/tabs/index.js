
var $ = require('zepto');

function Tabs(options){
	this.nav = $(options.nav);
	this.content = $(options.content);
	this.active = options.active || 'active';
	this.switchBack = options.switchBack;

	this._init();
}

Tabs.prototype = {

	_init: function(){
		var self = this;
		var $cur = self.nav.filter('.active');
		var $content = $(self.content[self._getOrder($cur)]);

		self.content.css('display', 'none');
		$content.css('display', 'block');

		self._addEvent();
	},

	_addEvent: function(){
		var self = this;

		self.nav.on('click', function(evt){
			self._switch(evt);
		});

	},

	_switch: function(evt){
		var self = this;
		var active = self.active;
		var $cur = $(evt.currentTarget);
		var $content;
		var navParent = self.nav.parent();
		// var cssPos = navParent.css('position');
		// var offset = navParent.offset();

		if($cur.hasClass(active)){
			return;
		}

		$content = $(self.content[self._getOrder($cur)]);

		self.nav.removeClass(active);
		$cur.addClass(active);

		self.content.css('display', 'none');
		$content.css('display', 'block');

		self.switchBack && self.switchBack();

		// if(cssPos == 'fixed'){
		// 	window.scroll(0, offset.top);
		// }
	},

	_getOrder: function($cur){
		var self = this;
		var order = 0;

		self.nav.each(function(i, item){
			if(item === $cur[0]){
				order = i;
				return false;
			}
		});

		return order;
	}

};

module.exports = Tabs;