var _ = require('underscore');
var $ = require('zepto');

var Util = require('common/util/index');
var Ajax = require('common/ajax/index');
var Config = require('common/config/index');
var PageLoader = require('common/page-loader/index');
var Bubble = require('common/bubble/bubble');
var Timer = require('common/timer/timer');
var FixTop = require('common/fix-top/index');

require('common/gotop/index');
require('search-panel/index');

new PageLoader({
	container: '#J-goods-list',
	pageBegin: 2,
	scrollKey: location.pathname + location.search,
	getHtml: function(pageNum, back) {
		new Ajax().send({
			url: ($('#J-ajax-url').val()),
			data: {
				order: Util.getParam('order'),
				type: Util.getParam('type'),
				page: pageNum,
				key: decodeURIComponent(Util.getParam('key'))
			}
		}, function(result) {
			back && back(__inline('item.tmpl')({
				list: result.goodsList
			}));
		});


	}
}).loadEnd(function() {
	Bubble.show('亲，没有更多商品了~');
});

$('[timer]').each(function(i, el) {

	new Timer(el, function(time) {
		var hour = parseInt(time / 3600, 10);
		var min = parseInt((time - hour * 3600) / 60);
		var sec = time - hour * 3600 - min * 60;
		var day = parseInt(hour / 24);

		hour = hour - day * 24;

		return (day ? (Timer.addZero(day) + '天') : '') + Timer.addZero(hour) + ':' + Timer.addZero(min) + ':' + Timer.addZero(sec);

	}).start();

});


new FixTop({
	el: '.goods-order'
});


init();

function init() {
	initCat();
	addEvt();
	initCart();
}

/**
 * 初始化二级分类
 * @return {[type]} [description]
 */
function initCat() {
	var $catList = $('#J-cat-list');

	$('#J-cat-btn').on('touchstart', function(e) {
		e.stopPropagation();
	}).on('click', function() {
		$catList.toggle();
	});
	$(document.body).on('touchstart', function() {
		$catList.hide();
	});
	$catList.on('touchstart', function(e) {
		e.stopPropagation();
		sessionStorage.clear();
	});
}


function addEvt() {
	$('#J-goods-list').on('click', '.J-add-cart', addCart);
}

/**
 * 初始化购物车
 */
function initCart() {
	new Ajax().send({
		url: $('#J-ajaxurl-initCart').val()
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

/**
 * 添加到购物车
 */
function addCart() {
	var $cur = $(this);
	var goodsId = $cur.attr('goods-id');

	new Ajax().send({
		url: $('#J-ajaxurl-addCart').val(),
		type: 'post',
		data: {
			goodsId: goodsId,
		}
	}, function() {
		initCart();
	});
}