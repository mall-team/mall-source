var $ = require('zepto');

// var TimerManager = {
// 	start: function(el) {
// 		$(el).each(function(i, curEle) {
// 			var time = $(curEle).attr('timer');

// 			if (time) {
// 				new Timer(time, curEle);
// 			}
// 		});
// 	}
// };

function Timer(el, format) {
	this.$el = $(el);
	this.format = format;

	var endTime = +this.$el.attr('timer-end');
	var starTime = typeof phpdata == 'object' ? phpdata.serverTime : null;
	var lastTime = +this.$el.attr('timer');

	if (endTime && starTime) {
		this.lastTime = endTime - starTime;
	} else if (lastTime || lastTime == 0) {
		this.lastTime = this.oTime = lastTime;
	}

	this.day = 0;
	this.hour = 0;
	this.min = 0;
	this.sec = 0;
	this._timer = null;
}

Timer.prototype = {

	start: function() {
		var self = this;

		if (!self.lastTime && self.lastTime != 0) {
			return;
		}

		self._walk();
		return self;
	},

	end: function(back) {
		this._endBack = back;
		return this;
	},

	_walk: function() {
		var self = this;

		self.$el.html(self._format(self.lastTime < 0 ? 0 : self.lastTime));

		if (self.lastTime <= 0) {
			if (this.oTime > 0) {
				self._endBack && self._endBack();
			}
			return;
		}
		self.lastTime--;
		self._timer = setTimeout(function() {
			self._walk();
		}, 1000);
	},

	_format: function(time) {
		var self = this;


		var hour = parseInt(time / 3600, 10);
		var min = parseInt((time - hour * 3600) / 60);
		var sec = time - hour * 3600 - min * 60;

		var day = parseInt(hour / 24);

		hour = hour - day * 24;

		self.day = day;
		self.hour = hour;
		self.min = min;
		self.sec = sec;

		if (typeof self.format === 'function') {
			return self.format(time);
		}
		
		if (self.format == 'single') {
			if (day > 0) {
				return self._addZero(day) + '天';
			} else if (hour > 0) {
				return self._addZero(hour) + '小时';
			} else if (min > 0) {
				return self._addZero(min) + '分钟';
			} else if (sec > 0) {
				return self._addZero(sec) + '秒';
			} else {
				return '0秒';
			}
		}

		if (self.format == 'time') {
			return self._addZero(day * 24 + hour) + ':' + self._addZero(min) + ':' + self._addZero(sec);
		}

		return (day > 0 ? self._addZero(day) + '天' : '') + self._addZero(hour) + '时' + self._addZero(min) + '分' + self._addZero(sec) + '秒';
		// return (day > 0 ? self._addZero(day) + '天' : '') + (hour > 0 ? self._addZero(hour) + '时' : '') + (min > 0 ? self._addZero(min) + '分' : '') + self._addZero(sec) + '秒';
	},

	_addZero: function(num) {
		if (num.toString().length < 2) {
			return '0' + num;
		}
		return num;
	}

};

Timer.addZero = function(num) {
	if (num.toString().length < 2) {
		return '0' + num;
	}
	return num;
};

module.exports = Timer;