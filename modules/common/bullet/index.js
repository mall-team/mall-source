var $ = require('zepto');
var Util = require('common/util/index');

var colors = ['#fff', '#918dfe', '#f371b1', '#23cebd'];
var duration = [1000, 1500, 2000, 2500];
// var speed = ['slow', 'normal', 'fast', 'faster'];
// var duration = [4000, 4500, 5000, 5500];
// var speed = [3000, 3500, 4000, 4500];
var speed = [4000];

var winWid = $(window).width();

function Bullet(container, textList) {
	this.container = $(container);
	this.textList = textList;

	this._index = 0;
	this._init();
}

Bullet.prototype = {
	tmpl: __inline('index.tmpl'),

	start: function() {
		var self = this;

		self.$list.each(function() {
			self._frame($(this));
		});
	},

	_init: function() {
		var self = this;
		var $el;

		$el = self.$el = $(self.tmpl());
		self.$list = $el.children('.bullet-list');

		self.container.html($el);
	},

	_frame: function($curList) {
		var self = this;
		// var $lastEl = $curList.children().eq(-1);

		// if (!$lastEl[0] || $lastEl.width() < winWid) {
		self._addItem($curList)
			// }

		setTimeout(function() {
			self._frame($curList);
		}, duration[Util.random2(0, duration.length)]);
	},

	_addItem: function($curList) {
		var self = this;
		var text = self.textList[self._index];
		var $el, wid;
		var $lastEl = $curList.children().eq(-1);
		var offsetLeft;

		wid = text.length * 15 + 30;

		if ($lastEl[0]) {
			offsetLeft = $lastEl.offset().left;
			console.log('------:' + offsetLeft);
		}
		if ($lastEl[0] && offsetLeft + $lastEl.width() > winWid) {
			// console.log('--222:' + (offsetLeft + wid));
			// console.log('--333:' + winWid + '---------------------------------------');
			return;
		}

		$el = $('<div class="item" style="color:' + colors[Util.random2(0, colors.length)] + ';right: ' + (-wid) + 'px;">' + text + '</div>');
		$curList.append($el);

		$el.animate({
			translateX: -(wid + winWid) + 'px'
		}, speed[Util.random2(0, speed.length)] * ((wid + winWid) / 320), 'linear', function() {
			$el.remove();
		});

		self._index++;
		if (self._index >= self.textList.length) {
			self._index = 0;
		}
		return $el;
	}
};



module.exports = Bullet;