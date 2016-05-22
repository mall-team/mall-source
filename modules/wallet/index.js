var $ = require('zepto');
var Tabs = require('common/tabs/index');
var Ajax = require('common/ajax/index');
var PageLoader = require('common/page-loader/index');
var FixTop = require('common/fix-top/index');
var Bubble = require('common/bubble/bubble');
var Copyright = require('common/copyright/index');
var Pop = require('common/pop/index');
var WxPay = require('common/wxpay/index');

new FixTop({
	el: '.wallet-detail .nav'
});

new Tabs({
	nav: '.nav li',
	content: '.detail-list'
});

Copyright.reset();

new PageLoader({
	container: '#J-bill-all',
	pageBegin: 2,
	getHtml: function(pageNum, back) {

		new Ajax().send({
			url: $('#J-ajax-url').val() || '/User/Center/walletList',
			data: {
				page: pageNum
			}
		}, function(result) {
			back && back(__inline('item.tmpl')({
				list: result.data
			}));

			Copyright.reset();
		})

	}
}).loadEnd(function() {
	Bubble.show('亲，没有更多数据了~');
});

new PageLoader({
	container: '#J-bill-out',
	pageBegin: 2,
	getHtml: function(pageNum, back) {

		new Ajax().send({
			url: $('#J-ajax-url').val() || '/User/Center/walletList',
			data: {
				page: pageNum,
				type: 2
			}
		}, function(result) {
			back && back(__inline('item.tmpl')({
				list: result.data
			}));
			Copyright.reset();
		})

	}
}).loadEnd(function() {
	Bubble.show('亲，没有更多数据了~');
});

new PageLoader({
	container: '#J-bill-in',
	pageBegin: 2,
	getHtml: function(pageNum, back) {

		new Ajax().send({
			url: $('#J-ajax-url').val() || '/User/Center/walletList',
			data: {
				page: pageNum,
				type: 1
			}
		}, function(result) {
			back && back(__inline('item.tmpl')({
				list: result.data
			}));
			Copyright.reset();
		})

	}
}).loadEnd(function() {
	Bubble.show('亲，没有更多数据了~');
});


function formatDate(time) {
	var date = new Date(time);
	return _addZero(date.getMonth() + 1) + '-' + _addZero(date.getDate()) + ' ' + _addZero(date.getHours()) + ':' + _addZero(date.getMinutes());
}

function _addZero(num) {
	if (num.toString().length == 1) {
		num = '0' + num;
	}
	return num;
}


/**
 * 提现
 * @return {[type]} [description]
 */
(function() {
	var _tmpl = $('#J-tx-tmpl').html();
	var _tmplYes = $('#J-tx-yes-tmpl').html();
	var hasAccount = $('#J-has-pay-account').val() == 1;
	var userAccount;
	var $btn = $('#J-tixian');

	var $nextBtn, $submitBtn;


	$btn.on('click', function() {

		if ($btn.hasClass('disabled')) {
			return;
		}

		if (hasAccount) { //有帐号
			showSec();
		} else {
			showFir();
		}

	});

	function showFir() {
		Pop.show({
			title: '提现账户',
			content: _tmpl
		});

		$nextBtn = $('#J-next-btn');
		$nextBtn.on('click', next);
	}

	function next() {
		var $form = $('#J-next-form');
		var url = $form.attr('action');
		var type = $form.attr('method');
		var data = $form.serialize();
		var account = $('#J-account-input').val();

		if (!account) {
			Bubble.show('请输入你的支付宝帐号');
			return false;
		} else if (account.length > 50) {
			Bubble.show('支付宝帐号长度过长');
			return false;
		}
		new Ajax().send({
			url: url,
			data: data,
			type: type,
		}, function(result) {
			hasAccount = true;
			userAccount = account;
			Pop.hide(function() {
				showSec();

			});
		});
	}

	function showSec() {
		Pop.show({
			title: '提现',
			content: _tmplYes
		});

		var $yes = $('#J-account-yes');
		var yesVal = $yes.text();

		if (!yesVal && userAccount) {
			$yes.text(userAccount);
		}

		$submitBtn = $('#J-tx-sumit');
		$submitBtn.on('click', tixian);
	}

	/**
	 * 提现
	 * @return {[type]} [description]
	 */
	function tixian() {
		var $form = $('#J-tx-form');
		var url = $form.attr('action');
		var type = $form.attr('method');
		var data = $form.serialize();

		new Ajax().send({
			url: url,
			data: data,
			type: type,
		}, function(result) {
			Pop.hide(function() {});
		});
	}

})();

/**
 * 充值
 * @return {[type]} [description]
 */
// (function() {
// 	var $input, $wxBtn, $aliBtn;

// 	$('#J-chongzhi').on('click', showPop);

// 	function showPop() {
// 		Pop.show({
// 			title: '充值',
// 			content: $('#J-cz-tmpl').html()
// 		});

// 		$input = $('#J-cz-input');
// 		$wxBtn = $('#J-wx-btn');
// 		$aliBtn = $('#J-alipay-btn');

// 		$wxBtn.on('click', weixinPay);
// 	}

// 	function weixinPay() {
// 		new Ajax().send({
// 			url: '/Mall/Pay/vipDirectPay'
// 		}, function(result) {

// 			WxPay.callpay(result.jsParams, result.url);

// 		});
// 	}


// })();