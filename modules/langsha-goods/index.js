var EVENT_TAP = 'click';

var $ = require('zepto'),
	_ = require('underscore');

var Conf = require('common/config/index');
var PageLoader = require('common/page-loader/index');
var Ajax = require('common/ajax/index');
var Bubble = require('common/bubble/bubble');
var Guide = require('common/guide/guide');
var Amount = require('common/amount/index');
var amount = new Amount();

var Swiper = require('common/swiper/index');

new Swiper({
	container: 'banner',
	pager: 'bannerPager'
});

new Guide('#J-share');

/**
 * 数量 颜色等选择等浮层
 * @type {Object}
 */
var Panel = {
	type: '',
	init: function() {
		var self = this;
		var $panel = $('#J-panel-cm');
		var $close = $panel.find('.close');
		var $mask = $panel.find('.mask');
		var $ok = $panel.find('.J-ok');

		$close.on(EVENT_TAP, function(evt) {
			self.hidden();
			evt.preventDefault();
		});
		$mask.on(EVENT_TAP, function(evt) {
			self.hidden();
			evt.preventDefault();
		});
		$ok.on(EVENT_TAP, function(evt) {
			self.hidden();

			if (self.type == 'cart') {
				addCar();
			} else {
				quickBuy();
			}
			evt.preventDefault();
		});

		self._initSel();
	},
	_initSel: function() {
		var self = this;

		self._resetSku();
		amount.init();
		$('#J-cm').delegate('label', EVENT_TAP, function(evt) {
			var $cur = $(evt.target);

			$cur.siblings('label').removeClass('sel');
			$cur.addClass('sel');
			$cur.siblings('input').val($cur.attr('value'));

			self._resetSku();
			amount.resetBtn();
		});

	},

	_resetSku: function() {
		var sku = search_sku_key();

		$('#J-last-num').text(sku.sku_num);
		$('.J-amount-bar').attr('max', sku.sku_num);
	},

	show: function(ty) {
		var $cm = $('#J-panel-cm');
		var $mask = $cm.find('.mask');
		var $content = $cm.find('.panel-content');

		this.type = ty;
		$cm.css('display', 'block');
		$content.animate({
			translateY: '0'
		}, 500, 'ease-out');
		$mask.animate({
			opacity: '0.6'
		}, 500, 'ease-out');

	},
	hidden: function() {
		var $cm = $('#J-panel-cm');
		var $mask = $cm.find('.mask');
		var $content = $cm.find('.panel-content');

		$content.animate({
			translateY: '100%'
		}, 500, 'ease-in', function() {
			$cm.css('display', 'none');
		});
		$mask.animate({
			opacity: 0
		}, 500, 'ease-in');
	}
}

var CartNum = {
	init: function() {
		var $cartNum = $('#J-cart-num');
		var num = +$cartNum.text();

		if (num && num > 0) {
			$cartNum.addClass('has-num');
		} else {
			$cartNum.removeClass('has-num');
		}
	},
	add: function(num) {
		var $cartNum = $('#J-cart-num');
		var curNum = +$cartNum.text();

		$cartNum.text(curNum + num).addClass('has-num');
	}
};
CartNum.init();


function initPage() {
	Panel.init();

	addEvent();

	new PageLoader({
		container: '.comment-list',
		seeMore: '.see-more',
		getHtml: function(pageNum, back) {

			new Ajax().send({
				url: '/index.php/goodsAction/moreComment',
				data: {
					g: getParam('g'),
					page: pageNum
				}
			}, function(result) {
				back && back(__inline('comment-item.tmpl')({
					list: result.data
				}), result.total_num);
			});


		}
	}).loadEnd(function() {
		$('.see-more').remove();
	});

}

function addEvent() {
	$('#J-btn-cart').on(EVENT_TAP, function(evt) {
		Panel.show('cart');
		evt.preventDefault();
	});

	$('#J-btn-buy').on(EVENT_TAP, function(evt) {
		Panel.show('buy');
		evt.preventDefault();
	});
}

initPage();


function getParam(name) {
	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	var search = location.search;
	var r = search.substr(1).match(reg);

	if (search && r) {
		return r[2];
	} else {
		return '';
	}
}


function addCar() {
	if ($('#spe_id').val() > 0) {
		if ($('#spe_already_start').val() == 0) {
			return false;
		}
	}
	var goods_id = $("#gid").val();
	var sku_info = search_sku_key();
	// var goods_number = parseInt($('#goods_number').val());
	var goods_number = parseInt($('#J-cm-amount').find('.amount-val').text(), 10);

	if (!sku_info) {
		Bubble.show('请选择商品属性');
		return;
	}
	if (parseInt(sku_info.sku_num) == 0 || parseInt(sku_info.sku_num) < goods_number || sku_info.sku_id == 'empty') {
		Bubble.show('已经卖光了，下次早点哦!');
		return;
	}
	var url = Conf.host + '/index.php/CartAction/addCart';
	var data = {
		goods_id: goods_id,
		sku_id: sku_info.sku_id,
		goods_number: goods_number,
		type: 'add_cart'
	};

	new Ajax().send({
		url: url,
		data: data,
		selfBack: true
	}, function(resp) {
		if (resp.code == 1) {
			CartNum.add(goods_number);
		} else if (resp.code == 5) {
			Bubble.show(resp.msg);
			setTimeout(function() {
				window.location.href = resp.url;
			}, 2000);
		} else {
			Bubble.show(resp.msg);
		}
	});
}


function quickBuy() {
	if ($('#spe_id').val() > 0) {
		if ($('#spe_already_start').val() == 0) {
			return false;
		}
	}
	var goods_id = $("#gid").val();
	var sku_info = search_sku_key();
	var goods_number = parseInt($('#J-cm-amount').find('.amount-val').text(), 10);

	if (!sku_info) {
		Bubble.show('请选择商品属性');
		return;
	}
	if (parseInt(sku_info.sku_num) == 0 || parseInt(sku_info.sku_num) < goods_number || sku_info.sku_id == 'empty') {
		Bubble.show('已经卖光了，下次早点哦!');
		return;
	}
	var url = Conf.host + '/index.php/CartAction/temp_car';
	var data = {
		goods_id: goods_id,
		goods_number: goods_number,
		sku_id: sku_info.sku_id
	};

	new Ajax().send({
		url: url,
		data: data,
		selfBack: true
	}, function(resp) {
		if (resp.code == 1) {
			window.location.href = resp.url;
		} else {
			Bubble.show(resp.msg);
		}
	});
}

function search_sku_key() {
	var sku_key = [];
	var checked = '';
	var exit = false;
	var $dts = $('#J-cm').find('dt');
	var $dds = $('#J-cm').find('dd');

	$dts.each(function(i, dt) {
		var $dt = $(dt);
		var $dd = $($dds[i]);

		sku_key.push($dt.text() + ':' + $dd.find('.sel').text())

	});

	var sku_json = $('#goods_sku_json').val();
	var sku_o = eval('(' + sku_json + ')');
	var res = {
		sku_id: 'empty'
	};
	for (var i = 0; i < sku_o.length; i++) {
		if (sku_key.join(',') == sku_o[i].sku_value) {
			res = sku_o[i];
			break;
		}
	}
	return res;
}