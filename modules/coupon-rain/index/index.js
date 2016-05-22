var $ = require('zepto');
var Ajax = require('common/ajax/index');
var Alert = require('common/alert/alert');
var Guide = require('common/guide/guide');

var itemStyle = ['item1', 'item2', 'item3', 'item4', 'item5'];
// var speed = ['slow'];
var speed = ['', 'fast', 'faster'];
var duration = [500, 1000, 1500];

var couponList = [],
	curIndex = 0,
	isOver = false,
	couponAmount = 0;

var openid = $('#J-openid').val();
var $list1 = $('#J-list-1');
var $list2 = $('#J-list-2');

init();

function init() {
	$('#J-container').on('touchstart', function(evt) {
		evt.preventDefault();
	});
	$('#J-start').on('touchstart', start);
}

function start() {

	startReq(function() {
		timerDown();
		$('#J-container').addClass('playing');

		startGetList(function() {
			startLeft();
			startRight();
		});
	});
}

function startLeft() {
	var $item = genItem();

	if (isOver) {
		return;
	}
	if ($item) {
		$list1.append($item);
	}

	setTimeout(function() {
		startLeft();
	}, duration[random(0, duration.length)]);
}

function startRight() {
	var $item = genItem();

	if (isOver) {
		return;
	}
	if ($item) {
		$list2.append($item);
	}

	setTimeout(function() {
		startRight();
	}, duration[random(0, duration.length)]);
}

/**
 * 计时
 * @return {[type]} [description]
 */
function timerDown() {
	var sec = 19;
	var timer;
	var $timer = $('#J-timer-down');

	$timer.html('还剩<b>' + sec + '</b>秒');
	timer = setInterval(function() {

		sec--;
		$timer.html('还剩<b>' + sec + '</b>秒');

		if (sec <= 0) {
			isOver = true;
			clearInterval(timer);

			new Ajax().send({
				url: '/Activity/CouponRain/getCatchedCouponCount'
			}, function(result) {
				couponAmount = result.count;
				alertMsg();
			});

		}

	}, 1000);

}


function alertMsg(data) {

	if (!data) {

		data = {
			title: '手气不错哦',
			msg: '共抢到' + couponAmount + '张优惠券',
			type: 'ok'
		};

		if (couponAmount == 0) {
			data = {
				title: '时运不济啊',
				msg: '共抢到0张优惠券',
				type: 'warning'
			};
		}
	}

	Alert.show(__inline('alert.tmpl')(data), false, 'coupon-rain-alert');
	new Guide('#J-coupon-invite', 'coupon-guide', '邀请好友来一起抢吧～<br/><i>怎么邀请？你懂得！</i>');
}


function genItem() {
	var $el;
	var coupon = couponList[curIndex];

	if (!coupon) {
		return false;
	}

	$el = $('<div type="' + coupon.type + '" code="' + coupon.code + '" class="item ' + itemStyle[random(0, itemStyle.length)] + ' ' + speed[random(0, speed.length)] + '"></div>');

	curIndex++;

	$el.on('touchstart', function() {
		var type = $el.attr('type');
		var code = $el.attr('code');

		if (type == 1) {
			// couponAmount++;
			$el.addClass('award');
		} else {
			$el.addClass('bomb');
		}
		setTimeout(function() {
			$el.remove();
		}, 500);
		getAward(code);
	}).on(getAniEndName().aniEvtName, function() {
		$el.remove();
	});

	return $el;
}

function getAward(code) {
	new Ajax().send({
		url: '/Activity/CouponRain/catchOne',
		data: {
			code: code,
			openid: openid
		}
	}, function() {

	});
}

function startReq(back) {
	new Ajax().send({
		url: '/Activity/CouponRain/start',
		data: {
			openid: openid
		}
	}, function(result) {
		if (result.joined == 1) {
			alertMsg({
				title: '您已经抢过啦~',
				msg: '您已经抢完了，下次再抢哦~',
				type: 'warning'
			});
			return;
		}
		back && back();
	});
}

function startGetList(firBack) {
	getCouponList(firBack);

	if (isOver) {
		return;
	}
	setTimeout(function() {
		startGetList();
	}, 5000);
}

function getCouponList(firBack) {
	new Ajax().send({
		url: '/Activity/CouponRain/getCouponList',
		data: {
			c: 20,
			openid: openid
		}
	}, function(result) {
		couponList = couponList.concat(result.list);

		firBack && firBack();
	});
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