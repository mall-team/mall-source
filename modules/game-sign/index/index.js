var Ajax = require('common/ajax/index');
var Alert = require('common/alert/alert');
var Tabs = require('common/tabs/index');
var Bubble = require('common/bubble/bubble');

var prizeDeg = [80, 40, 360, 318, 278, 238, 200, 159, 119];
var awardTmpl = __inline('award.tmpl');
var awarding = false; //抽资中

init();

function init() {
	addEvent();

	new Tabs({
		nav: '.tab-nav > li',
		content: '.tab-container > .item-container'
	});

}

function addEvent() {
	$('.signin-btn').on('click', sign);
	$("#prizestar").on('click', start);
	$('#J-wake-sign').on('click', subRemind);
}

/**
 * 订阅提醒
 * @return {[type]} [description]
 */
function subRemind() {
	var $cur = $(this);
	var state = 0; //0订阅 1取消订阅

	if ($cur.hasClass('waked')) { //订阅过
		state = 1;
	}
	new Ajax().send({
		url: '/Game/LotteryDraw/setLotteryDrawRemind',
		data: {
			state: state
		}
	}, function() {
		if (state == 0) { //订阅成功
			$cur.addClass('waked');
		} else { //取消订阅成功
			$cur.removeClass('waked');
		}
	});
}

/**
 * 签到
 * @return {[type]} [description]
 */
function sign() {
	var $cur = $(this);

	if ($cur.hasClass('disabled')) {
		return;
	}

	new Ajax().send({
		url: ' /Game/LotteryDraw/sign',
		selfLoginSuc: function() {
			location.reload();
		}
	}, function(result) {

		$cur.addClass('disabled').text('已签到');
		$('#J-sign-days').text(result.loginDays);
		$('#J-award-amount').text(result.logteryDrawTimes);
		$('#J-scroe-num').text(result.score);

		if (result.loginDays == 5) {
			$('.dy5').addClass('active2');
		} else if (result.loginDays == 1) {
			$('.days-box > span').removeClass('active');
			$('.days-box > .dy5').removeClass('active2');
			$('.days-box > .dy1').addClass('active');
		} else {
			$('.dy' + result.loginDays).addClass('active');
		}
	});
}

/**
 * 开始抽奖
 * @return {[type]} [description]
 */
function start() {
	if(+$('#J-award-amount').text() <= 0){
		Bubble.show('抽奖次数不足');
		return false;
	}
	if (awarding) {
		return false;
	}

	awarding = true;

	new Ajax().send({
		url: ' /Game/LotteryDraw/startLucky',
		selfLoginSuc: function() {
			location.reload();
		}
	}, function(result) {

		rotateFunc(prizeDeg[result.winNumber], result);

	}, function() {
		awarding = false;
	});

}

function rotateFunc(angle, result) { //angle:奖项对应的角度
	var Deg = 360 * 10; //指针旋转圈数。
	angle = angle + Deg; //angle是图片上各奖项对应的角度，
	$('#rotatebg').stopRotate();
	$("#rotatebg").rotate({
		angle: 0,
		duration: 5000,
		animateTo: angle,
		// easing: $.easing.easeInOutElastic,
		callback: function() {
			var type = result.type; //0、未中奖 1、积分 2、优惠券 3、商品
			var $amount = $('#J-award-amount');
			var num = +$amount.text();

			awarding = false;
			if (--num < 0) {
				num = 0;
			}

			$amount.text(num);

			if (result.winNumber == 0) { //未中奖

				Alert.show(awardTmpl({
					msg: 'TOT',
					tip: '不是不中奖，只是缘分少了点~',
					isGoods: false
				}), true, 'award-alert');

			} else { //中奖

				Alert.show(__inline('award.tmpl')({
					msg: '恭喜您！抽中了' + result.msg,
					tip: '人品大爆炸啦~',
					isGoods: result.type == 3 //如果是商品，需要领取
				}), !(type == 3), 'award-alert');

				if (type == 1) { //积分
					var $score = $('#J-scroe-num');
					$score.text(result.score + (+$score.text()));
				}

			}

			//确认领奖
			$('.J-goods-yes').on('click', function() {
				location.href = result.awardUrl;
			});

			$('.J-drop-btn, .J-yes-btn').on('click', function() {
				Alert.hide();
			});
		}
	});
}