var $ = require('zepto');
var Amount = require('common/amount/index');
var Ajax = require('common/ajax/index');
var Bubble = require('common/bubble/bubble');
var Confirm = require('common/confirm/index');
var Timer = require('common/timer/timer');
var Nav = require('common/nav/index');

function init() {
	Nav.initCart();
	
	//初始化数字选择器
	$('.J-amount-bar').each(function(i, el) {
		new Amount(el).init(upadateNum);
	});

	resetCheckbox();
	checkAll();
	//计算总价
	calculate();
	initTimer();

	addEvent();
}

/**
 * 初始化特卖倒计时
 * @return {[type]} [description]
 */
function initTimer() {
	$('.J-tm-timer').each(function(i, el) {
		new Timer(el, function() {
			var self = this;

			if (self.day > 0) {
				return self.day + '天';
			} else {
				return Timer.addZero(self.hour) + ':' + Timer.addZero(self.min) + ':' +Timer.addZero(self.sec);
			}
			console.log(this.hour);
		}).start().end(function() {
			location.reload();
		});
	});
	new Timer().start();
}

function resetCheckbox() {
	var $inputList = $('.cart-list .J-checkbox-val');
	var $radioList = $('.cart-list .radio');

	$inputList.each(function(i, item) {
		var $input = $(item);
		var $radio = $($radioList[i]);

		if ($input.val() == 0) {
			$radio.removeClass('active');
		} else {
			$radio.addClass('active');
		}
	});

	// $inputList.val(0);
	// $radioList.removeClass('active');
}

function addEvent() {
	//单选侦听
	$('.cart-list').on('click', '.radio', function() {
		var $cur = $(this);
		var $li = $cur.parents('li');
		var $checkbox = $li.find('.J-checkbox-val');
		var amount = +$li.find('.amount-val').text();
		var state = +$li.find('.J-state').val();
		var id = $li.find('.J-id').val();

		if (state == 3) {
			Bubble.show('商品已下架');
			return;
		}
		if (amount == 0) {
			Bubble.show('该商品暂无库存');
			return;
		}
		if ($cur.hasClass('active')) {
			$cur.removeClass('active');
			$checkbox.val(0);
		} else {
			$cur.addClass('active');
			$checkbox.val(id);
		}
		checkAll();
		calculate();

		return false;
	});

	//全选侦听
	$('#J-sel-all').on('click', function() {
		var $radioList = $('.cart-list .radio');
		var $inputList = $('.cart-list .J-checkbox-val');
		var $idList = $('.cart-list .J-id');
		var $all = $(this);

		if ($all.hasClass('active')) { //全不选

			$radioList.removeClass('active');
			$inputList.val(0);
			$all.removeClass('active');

		} else {
			$radioList.each(function(i, radio) {
				var $radio = $(radio);
				var $input = $($inputList[i]);
				var amount = +$radio.parents('li').find('.amount-val').text();
				var id = $($idList[i]).val();

				if (amount > 0) {
					$radio.addClass('active');
					$input.val(id);
				}

			});
			$all.addClass('active');
		}

		calculate();
		return false;
	});

	//删除
	$('.cart-list').on('click', '.btn-del', function() {
		del($(this));;
		return false;
	});

	//结算
	$('#J-buy').on('click', function() {
		var isNone = true;
		var $inputList = $('.cart-list .J-checkbox-val');

		$inputList.each(function(i, input) {
			var $input = $(input);

			if ($input.val() != 0) {
				isNone = false;
				return false;
			}
		});
		if (isNone) {
			Bubble.show('请选择至少一件商品');
			return false;
		}
		// return false;
	});
}

function checkAll() {
	var $radioList = $('.cart-list .radio');
	var $all = $('#J-sel-all');
	var isAll = true;

	$radioList.each(function(i, radio) {
		if (!$(radio).hasClass('active')) {
			isAll = false;
			return false;
		}
	});

	if (isAll) {
		$all.addClass('active');
	} else {
		$all.removeClass('active');
	}

}

function upadateNum(v, el) {
	var $li = $(el).parents('li');
	var id = $li.find('.J-id').val();
	var price = +$li.find('.J-price').val();

	new Ajax().send({
		url: $('#J-ajaxurl-updateNum').val(),
		type: 'post',
		data: {
			id: id,
			number: v
		}
	}, function() {
		calculate();
		$li.find('.price b').text(price * 100 * v / 100);
	});
}

function del($ths) {
	var $li = $ths.parents('li');
	var id = $li.find('.J-id').val();

	Confirm.show({
		msg: '您确认从购物车删除该商品吗？',
		yesBack: function() {
			new Ajax().send(Ajax.formatAjaxParams($ths), function() {
				if ($li.siblings('li').length == 0) {
					location.reload();
				} else {
					$li.remove();
					calculate();
				}
			});
		}
	});
}

/**
 * 计算总价，总数量
 * @return {[type]} [description]
 */
function calculate() {
	var price = 0;
	var amount = 0;

	$('.cart-list .radio.active').each(function(i, el) {
		var $radio = $(el);
		var $li = $radio.parent();
		var curPrice = +$li.find('.J-price').val();
		var curAmount = +$li.find('.amount-val').text();

		price += curPrice * 100 * curAmount / 100;
		amount += curAmount;

	});
	$('#J-total-price').text((price).toFixed(2));
	$('#J-amount').text(amount);
}

init();