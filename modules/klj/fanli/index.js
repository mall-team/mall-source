var $ = require('zepto');
var Bubble = require('common/bubble/bubble');
var Pop = require('common/pop/index');
// var Tabs = require('common/tabs/index');
var PageLoader = require('common/page-loader/index');
var Ajax = require('common/ajax/index');
var Util = require('common/util/index');
var LoginPop = require('common/login-pop/index');
var Alert = require('common/alert/alert');

var $managerList = $('#J-manager-list');
var isLogin = !(typeof phpdata !== 'undefined' && phpdata.isLogin == 0);

init();

function init() {
	if (!isLogin) {
		LoginPop.show({
			Ajax: Ajax,
			loginSuc: function() {
				location.reload();
			}
		});
		return;
	}

	addEvent();

	// initTabs();
	if ($managerList.length > 0) {
		initManagerList();
	} else {
		initPageLoader();
	}
}

function addEvent() {
	$('#J-nopay-list, #J-pay-list').on('click', 'li', showPop);
	$('#J-gen-link').on('click', genLink);
	$('#J-rule-btn').on('click', showRule);
}

function showRule(){
	Alert.show($('#J-rule-tmpl').html());
}

function genLink() {
	var phone = $('#J-phone-num').val();

	if (!phone) {
		Bubble.show('请先输入手机号！');
		return;
	} else if (!/^\d{11}$/.test(phone)) {
		Bubble.show('您输入的手机号格式有误！');
		return;
	}
	new Ajax().send({
		url: '/Activity/Home/makeUrl',
		data: {
			phone: phone
		}
	}, function(result) {
		$('#J-url-text').text(result.url);
	});
}

/**
 * 初始化tab
 * @return {[type]} [description]
 */
// function initTabs() {
// new Tabs({
// 	nav: '.tab-nav li',
// 	content: '.content-item'
// });
// }

/**
 * 初始化分布
 * @return {[type]} [description]
 */
function initPageLoader() {
	var type = Util.getParam('type') || '1';
	var containerId;
	var _tmpl;

	switch (type) {
		case '1':
			containerId = '#J-pay-list';
			_tmpl = __inline('pay.tmpl');
			break;
		case '2':
			containerId = '#J-nopay-list';
			_tmpl = __inline('no-pay.tmpl');
			break;
	}

	new PageLoader({
		container: containerId,
		seeMore: '.see-more',
		pageBegin: 2,
		loading: '.J-more-loading',
		getHtml: function(pageNum, back) {

			new Ajax().send({
				url: '/Activity/Home/purchasedFriends',
				data: {
					page: pageNum,
					type: type
				}
			}, function(result) {
				back && back(_tmpl({
					list: result
				}));

			})

		}
	}).loadEnd(function() {
		Bubble.show('亲，没有更多数据了~');
		$('.see-more').remove();
	});
}

/**
 * 显示电话、短信浮层
 * @return {[type]} [description]
 */
function showPop() {
	var $cur = $(this);
	var tel = $cur.attr('tel');
	var chartHref = $cur.attr('chart-href');
	var _tmpl = __inline('contact.tmpl');

	$cur.parent().children('.active').removeClass('active');
	$cur.addClass('active');
	Pop.show({
		scroll: true,
		content: _tmpl({
			tel: tel,
			chartHref: chartHref
		})
	})
}

function initManagerList() {
	var _tmpl = __inline('manager.tmpl');

	new PageLoader({
		container: '#J-manager-list',
		seeMore: '.see-more',
		pageBegin: 2,
		loading: '.J-more-loading',
		getHtml: function(pageNum, back) {

			new Ajax().send({
				url: '/Activity/Home/getPartnerData',
				data: {
					page: pageNum
				}
			}, function(result) {
				back && back(_tmpl({
					list: result
				}));

			})

		}
	}).loadEnd(function() {
		Bubble.show('亲，没有更多数据了~');
		$('.see-more').remove();
	});
}