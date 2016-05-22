var $ = require('zepto');
var Swiper = require('common/swiper/index');
var Timer = require('common/timer/timer');
var Ajax = require('common/ajax/index');
var Util = require('common/util/index');
var FixTop = require('common/fix-top/index');

// require('common/gotop/index');

// setTimeout(function(){
// 	new FixTop({
// 		el: '.tab-nav'
// 	});
// }, 100);

new Swiper({
	container: 'banner',
	pager: 'bannerPager'
});


Util.phpdataReady(function(phpdata) {
	if (phpdata.subscribe == 0) {
		$('.atten-panel').css('display', 'block');
	}

	//全民砍价 倒计时
	new Timer('#J-cut-timer', function(time) {
		var hour = parseInt(time / 3600, 10);
		var min = parseInt((time - hour * 3600) / 60);
		var sec = time - hour * 3600 - min * 60;

		return '<span><b>' + Timer.addZero(hour) + '</b></span><i>:</i><span><b>' + Timer.addZero(min) + '</b></span><i>:</i><span><b>' + Timer.addZero(sec) + '</b></span>';
	}).start();

	$('.J-timer').each(function(i, el) {
		new Timer(el, 'time').start().end(function() {
			// location.reload();
		});
	});


});


/**
 * 初始化购物车
 */
function initCart() {
	new Ajax().send({
		url: '/Mall/Home/cartGoodsNumber'
	}, function(result) {
		var num = +result.number;
		var $cart = $('.cart');
		var $cartNum = $('.cart > i');

		if (num > 0) {
			$cart.css('display', 'block');
			$cartNum.text(num);
		}
	});
}

// initCart();

var tmplList = {
	'cut-list.tmpl': __inline('cut-list.tmpl'),
	'worth-list.tmpl': __inline('worth-list.tmpl'),
	'overseas.tmpl': __inline('overseas.tmpl'),
	'hot-list.tmpl': __inline('hot-list.tmpl')
};

var $navList = $('.tab-nav a[tmpl-href]');
var $tabContainer = $('.tab-container');

init();

function init() {
	initNav();
	addEvent();
}

function addEvent() {
	$navList.on('click', switchNav);
}

/**
 * 初始化导航
 */
function initNav() {
	switchNav('init');
}

/**
 * 导航切换
 */
function switchNav(isInit) {
	var $nav = isInit === 'init' ? $navList.eq(0) : $(this);
	var tmplHref = $nav.attr('tmpl-href');
	var htmlTmpl = tmplList[tmplHref]({
		list: [1, 2, 3, 4, 5]
	});

	$nav.parent().siblings('.active').removeClass('active');
	$nav.parent().addClass('active');
	$tabContainer.html(htmlTmpl);
}