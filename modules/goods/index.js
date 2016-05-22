var EVENT_TAP = 'click';

var $ = require('zepto');
var Swiper = require('common/swiper/index');
var ConfirmService = require('common/confirm-service/index');

var Conf = require('common/config/index');
var Ajax = require('common/ajax/index');
var Bubble = require('common/bubble/bubble');
var Guide = require('common/guide/guide');
var Util = require('common/util/index');
var Amount = require('common/amount/index');
var Alert = require('common/alert/alert');
var LoginPop = require('common/login-pop/index');
var Notice = require('notice/index');
var amount = new Amount();
var CommentSection = require('common/comment-section/index');

require('common/gotop/index');
var globalGuide = new Guide();

Notice.start();

Util.phpdataReady(function() {
	var $share = $('#J-share');

	if (typeof taojinzi === 'undefined') {
		new Guide($share);
	} else {
		$share.on('click', function() {
			taojinzi.share(JSON.stringify({
				title: title,
				link: link,
				imgUrl: imgUrl,
				desc: desc
			}));
		});
	}
});

var $phoneOk = $('#J-phone-ok2');

var $phone = $('#phone2');
var $code = $('#code2');
var $yzmBt = $('#J-yzm-bt2');

var winHei = $(window).height();
var winScrollY = 0;

new Swiper({
	container: 'banner',
	pager: 'bannerPager'
});

Util.phpdataReady(function(phpdata) {
	var isLogin = phpdata.isLogin;

	if (isLogin == 0) { //未登陆
		$('#J-panel-cm').addClass('add-phone');
		$yzmBt.on('click', getCode);
		$phoneOk.on('click', login);
	}
});


var minnum = Util.getParam('minnum');

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

		$panel.on('click', function() {
			return false;
		});

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

		// self._hasPhone();
		// if (!hasLogin) {
		// 	$yzmBt.on('click', getCode);
		// 	$phoneOk.on('click', login);
		// }
		self._initSel();
	},

	// _hasPhone: function() {

	// 	if (hasLogin) {
	// 		$('#J-panel-cm').removeClass('add-phone');
	// 	} else {
	// 		$('#J-panel-cm').addClass('add-phone');
	// 	}
	// },
	_initSel: function() {
		var self = this;

		// self._resetSku();
		amount.init();
		$('#J-cm').delegate('label', EVENT_TAP, function(evt) {
			var $cur = $(evt.target);

			$cur.siblings('label').removeClass('sel');
			$cur.addClass('sel');
			$cur.siblings('input').val($cur.attr('value'));

			// self._resetSku();
			amount.resetBtn();
		});

	},

	// _resetSku: function() {
	// 	var sku = search_sku_key();
	// 	var $bar = $('.J-amount-bar');

	// 	$('#J-last-num').text(sku.sku_num);

	// 	if (!$bar.attr('max')) {
	// 		$bar.attr('max', sku.sku_num);
	// 	}
	// 	$('#J-sku-price').text(sku.skuPrice);
	// },

	show: function(ty) {
		var $cm = $('#J-panel-cm');
		var $mask = $cm.find('.mask');
		var $content = $cm.find('.panel-content');

		this.type = ty;

		// winScrollY = window.scrollY;

		$cm.find('.amount-val').text(minnum ? minnum : 1);
		amount.resetBtn();
		$('html').attr('style', 'position: relative; overflow: hidden; height: ' + winHei + 'px;');
		$('body').attr('style', 'overflow: hidden; height: ' + winHei + 'px; padding: 0px;');
		$cm.css('display', 'block');
		$content.animate({
			translateY: '0'
		}, 300, 'ease-out');
		// $mask.animate({
		// 	opacity: '0.8'
		// }, 300, 'ease-out');
	},
	hidden: function() {
		var $cm = $('#J-panel-cm');
		var $mask = $cm.find('.mask');
		var $content = $cm.find('.panel-content');

		$content.animate({
			translateY: '100%'
		}, 300, 'ease-in', function() {
			$('html').attr('style', '');
			$('body').attr('style', '');
			$cm.css('display', 'none');
		});
		// $mask.animate({
		// 	opacity: 0
		// }, 300, 'ease-in', function(){
		// 	$('html').attr('style', '');
		// 	$('body').attr('style', '');
		// 	window.scroll(0, winScrollY);
		// });

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

/**
 * 获取验证码
 */
var disabled = false;

function getCode() {
	if (disabled) {
		return false;
	}

	var phone = $phone.val();
	var curTime = 60;

	new Ajax().send({
		url: '/WeChat/Band/sendMsg',
		data: {
			phone: phone
		}
	}, function() {
		disabled = true;
		$yzmBt.text(curTime).addClass('disabled');
		start();
	});

	function start() {
		setTimeout(function() {
			curTime--;
			$yzmBt.text(curTime);

			if (curTime <= 0) {
				disabled = false;
				$yzmBt.text('获取验证码').removeClass('disabled');
				return;
			}
			start();
		}, 1000)
	}
	return false;
}

/**
 * 验证登陆
 */
function login(evt) {
	evt.preventDefault();

	var phone = $phone.val();
	var code = $code.val();
	// var recommend = Util.getParam('recommend');
	var params;

	if (!phone) {
		Bubble.show('请输入您的手机号码');
		return false;
	} else if (!/^\d{11}$/.test(phone)) {
		Bubble.show('请输入正确的手机号码');
		return false;
	} else if (!code) {
		Bubble.show('请输入验证码');
		return false;
	}
	params = {
		phone: phone,
		code: code
	};
	// if(recommend){
	// 	params.recommend = recommend;
	// }

	ConfirmService.start(phone, code, Ajax, function(recommend) {
		if (recommend) {
			params.recommend = recommend;
		}

		new Ajax().send({
			url: '/WeChat/Band/bandAccount',
			type: 'post',
			data: params
		}, function() {
			Panel.hidden();

			if (Panel.type == 'cart') {
				addCar();
			} else {
				quickBuy();
			}
		});
	});
}


function initPage() {
	Panel.init();
	addEvent();
	CommentSection.init(); //初始始评论组件
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

	$('#J-make-money').on('click', makeMoney);
}

window.jumpurl = location.href;

initPage();

/**
 * 分销赚钱
 * @return {[type]} [description]
 */
function makeMoney(evt) {
	evt.preventDefault();

	var $cur = $(this);

	if (phpdata && phpdata.isLogin != 1) { //未登陆
		LoginPop.show({
			Ajax: Ajax,
			loginSuc: function() {
				// location.href = $cur.attr('href');
				showAlert();
			}
		});
		return false;
	}

	showAlert();

	return false;

	function showAlert() {
		new Ajax().send({
			url: '/Mall/Goods/goodsShareMoney'
		}, function(result) {
			var hasPermission = result.hasPermission;

			phpdata.isLogin = 1;
			if (hasPermission == 1) {
				globalGuide.show();
			} else {
				location.href = $cur.attr('href');
				// Alert.show($('#J-make-money-tmpl').html(), true, 'make-moeny-alert');
			}
		});


	}

}

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
	// var sku_info = search_sku_key();
	// var goods_number = parseInt($('#goods_number').val());
	var goods_number = parseInt($('#J-cm-amount').find('.amount-val').text(), 10);

	// if (!sku_info) {
	// 	Bubble.show('请选择商品属性');
	// 	return;
	// }
	// if (parseInt(sku_info.sku_num) == 0 || parseInt(sku_info.sku_num) < goods_number || sku_info.sku_id == 'empty') {
	// 	Bubble.show('已经卖光了，下次早点哦!');
	// 	return;
	// }
	var url = '/Mall/Cart/add';
	var data = {
		productId: goods_id,
		skuIds: sku_info.sku_id,
		skuTexts: sku_info.skuTexts,
		skuValues: sku_info.skuValues,
		skuValuesText: sku_info.skuValuesText,
		productNumber: goods_number
	};

	new Ajax().send({
		url: url,
		data: data,
		type: 'post',
		// selfBack: true
	}, function(resp) {
		resetCart();
		// if (resp.code == 1) {
		// CartNum.add(goods_number);
		// } else if (resp.code == 5) {
		// 	Bubble.show(resp.msg);
		// 	setTimeout(function() {
		// 		window.location.href = resp.url;
		// 	}, 2000);
		// } else {
		// 	Bubble.show(resp.msg);
		// }
	});
}


function quickBuy() {
	if ($('#spe_id').val() > 0) {
		if ($('#spe_already_start').val() == 0) {
			return false;
		}
	}
	var goods_id = $("#gid").val();
	// var sku_info = search_sku_key();
	var goods_number = parseInt($('#J-cm-amount').find('.amount-val').text(), 10);

	// if (!sku_info) {
	// 	Bubble.show('请选择商品属性');
	// 	return;
	// }
	// if (parseInt(sku_info.sku_num) == 0 || parseInt(sku_info.sku_num) < goods_number || sku_info.sku_id == 'empty') {
	// 	Bubble.show('已经卖光了，下次早点哦!');
	// 	return;
	// }
	var url = '/Mall/Pay/immediateBuy';
	var data = {
		productId: goods_id,
		skuIds: sku_info.sku_id,
		skuTexts: sku_info.skuTexts,
		skuValues: sku_info.skuValues,
		skuValuesText: sku_info.skuValuesText,
		productNumber: goods_number,
		spe: $('#J-goods-type').val(),
		speId: $('#J-spe-id').val()
	};


	new Ajax().send({
		url: url,
		data: data,
		type: 'post',
		selfSucBack: true
	}, function(result, originData) {

		var form = '<form action="' +
			originData.url + '" method="post">'

		$.each(data, function(key, val) {
			if (key != 'tjzAjax') {
				form += '<input type="hidden" name="' + key + '" value="' + val + '" />'
			}
		});

		form += '</form>';

		$(form).appendTo($('body')).submit();
	});
}

// function search_sku_key() {
// 	var sku_key = [];
// 	var checked = '';
// 	var exit = false;
// 	var $dts = $('#J-cm').find('dt');
// 	var $dds = $('#J-cm').find('dd');

// 	$dts.each(function(i, dt) {
// 		var $dt = $(dt);
// 		var $dd = $($dds[i]);

// 		// sku_key.push($dt.text() + ':' + $dd.find('.sel').text())
// 		sku_key.push($dd.find('.sel').text());

// 	});

// 	var sku_json = $('#goods_sku_json').val();
// 	var sku_o;
// 	var res = {};

// 	try {
// 		sku_o = JSON.parse(sku_json);
// 	} catch (e) {
// 		return;
// 	}
// 	for (var i = 0; i < sku_o.length; i++) {
// 		if ('|' + sku_key.join('|') + '|' == sku_o[i].sku_values_text) {
// 			res = sku_o[i];
// 			break;
// 		}
// 	}
// 	return {
// 		sku_num: res.actual_quantity || 0,
// 		sku_id: res.sku_ids || 'empty',
// 		skuTexts: res.sku_texts,
// 		skuValues: res.sku_values,
// 		skuValuesText: res.sku_values_text,
// 		skuPrice: res.retail_price
// 	};
// }

/**
 * 初始化购物车
 */
function resetCart() {
	new Ajax().send({
		url: $('#J-ajaxurl-initCart').val()
	}, function(result) {
		var num = +result.number;
		var $cart = $('#J-cart-num');

		if (num > 0) {
			$cart.text(num).parent().css('display', 'block');
		} else {
			$cart.parent().css('display', 'none');
		}
	});
}

setTimeout(function() {
	resetCart();
}, 0);