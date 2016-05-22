var $ = require('zepto');
var Ajax = require('common/ajax/index');
var JAjax = require('common/j-ajax/index');
var Guide = require('common/guide/guide');
var Alert = require('common/alert/alert');

var $pageBuy = $('#J-page-buy');
var pageBuyTop;

var buyState = 'normal';

init();

function init() {
	isOver();

	addEvent();

	start();

	JAjax.init();
	new Guide('#J-invite-btn', 'guide-klj');
}

function addEvent() {

	// if ($pageBuy.length > 0) {
	// 	$(window).on('scroll', _onScroll);
	// }
}

/**
 * 活动是否已结束
 * @return {Boolean} [description]
 */
function isOver() {
	var isOver = $(document.body).attr('act-over') == 1;

	if (isOver) {
		Alert.show($('#J-actover-tmpl').html(), false, 'act-over-alert');
	}
}

function start() {
	rendSendMoney();
	setTimeout(start, 5000);
}

function rendSendMoney(back) {
	new Ajax().send({
		url: '/Activity/Home/alreadySendRedPackage'
	}, function(result) {
		var $money = $('#J-send-money');

		if (result.redPackage != parseInt($money.text(), 10)) {
			$money.html(result.redPackage).addClass('money-ani');
			setTimeout(function() {
				$('#J-send-money').removeClass('money-ani');
			}, 1000);
		}
		back && back();
	});
}

// function _onScroll() {
// 	var winY = window.scrollY;

// 	if (!pageBuyTop) {
// 		pageBuyTop = $pageBuy.offset().top + $pageBuy.height();
// 	}

// 	if (winY > pageBuyTop) {
// 		if (buyState != 'fixed') {
// 			buyState = 'fixed';
// 			$('#J-fix-buy').css('display', 'block');
// 		}
// 	} else {
// 		if (buyState != 'normal') {
// 			buyState = 'normal';
// 			$('#J-fix-buy').css('display', 'none');

// 		}
// 	}
// }