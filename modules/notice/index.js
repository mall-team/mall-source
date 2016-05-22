var $ = require('zepto');

var timeSmall = [6, 8, 10, 12, 14];
var timeBig = [10, 15, 20, 25, 30];
var provinceArr = ["北京市", "天津市", "河北省", "山西省", "内蒙古自治区", "辽宁省", "吉林省", "黑龙江省", "上海市", "江苏省", "浙江省", "安徽省", "福建省", "江西省", "山东省", "河南省", "湖北省", "湖南省", "广东省", "广西壮族自治区", "重庆市", "四川省", "贵州省", "云南省", "陕西省", "甘肃省", "青海省", "宁夏回族自治区"]

var tmpl = __inline('index.tmpl')();
var $el, $msgWrap;
var num = 1;

function start() {
	var time;

	if (num > 1) {
		time = timeBig[random(0, 5)];
	} else {
		time = timeSmall[random(0, 5)];
	}
	setTimeout(function() {
		num++;
		show();
	}, time * 1000);
}

function show() {
	if (!$el) {
		$(document.body).append($el = $(tmpl));
		$msgWrap = $el.find('.notice-msg');
		$msgWrap.on(getAniEndName().aniEvtName, hide);
	}

	$msgWrap.text(random(2, 18) + '秒前，小金子收到来自' + provinceArr[random(0, 28)] + '的新订单');
	$el.addClass('block');
}

function hide() {
	$el.removeClass('block');
	start();
}


/**
 * 获取min到max之间的一个随机数(包含min，不含max)
 */
function random(min, max) {
	return min + Math.floor(Math.random() * max);
}

/**
 * 获取动画结束事件的名字
 */
function getAniEndName() {
	var transElement = document.createElement('trans');
	var transitionEndEventNames = {
		'WebkitTransition': 'webkitTransitionEnd',
		'MozTransition': 'transitionend',
		'OTransition': 'oTransitionEnd',
		'transition': 'transitionend'
	};
	var animationEndEventNames = {
		'WebkitTransition': 'webkitAnimationEnd',
		'MozTransition': 'animationend',
		'OTransition': 'oAnimationEnd',
		'transition': 'animationend'
	};

	function findEndEventName(endEventNames) {
		for (var name in endEventNames) {
			if (transElement.style[name] !== undefined) {
				return endEventNames[name];
			}
		}
	}
	return {
		transEvtName: findEndEventName(transitionEndEventNames),
		aniEvtName: findEndEventName(animationEndEventNames)
	};
}

module.exports = {
	start: start
};