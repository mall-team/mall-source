var $ = require('zepto');
var Ajax = require('common/ajax/index');
var Alert = require('common/alert/alert');

var _tmplList = {
	tmpl1: __inline('item.tmpl'),
	tmpl2: __inline('item2.tmpl')
};

var pageTy = 1; //1.我的引荐 2.小伙伴定单
var dayTy = 1; //1.今天2.昨天


init();

function init() {
	addEvent();

	rendTj();
	rendList();
}

function addEvent() {
	$('.tab-nav').on('click', 'li', pageSwitch);
	$('.partner-nav').on('click', 'li', daySwitch);
	$('#J-rule').on('click', showRule);
}

function showRule() {
	var html = '';

	if (pageTy == 1) {
		html = __inline('rule.tmpl')();
	} else {
		html = __inline('rule2.tmpl')();
	}

	Alert.show(html);
}

/**
 * 切换页面
 * @return {[type]} [description]
 */
function pageSwitch() {
	var $cur = $(this);
	var pTy = +$cur.attr('type');

	if (pageTy == pTy) {
		return false;
	}
	pageTy = pTy;
	dayTy = 1;

	$cur.siblings('.active').removeClass('active');
	$cur.addClass('active');

	rendTj(function() {
		rendList(function() {
			$('.partner-nav li').removeClass('active');
			$('.partner-nav li').eq(0).addClass('active');
		});
	});
}

/**
 * 切换日期
 * @return {[type]} [description]
 */
function daySwitch() {
	var $cur = $(this);
	var dTy = +$cur.attr('type');

	if (dayTy == dTy) {
		return false;
	}
	dayTy = dTy;
	rendList(function() {
		$cur.siblings('.active').removeClass('active');
		$cur.addClass('active');
	});
}

/**
 * 渲染统计信息
 * @return {[type]} [description]
 */
function rendTj(back) {
	new Ajax().send({
		url: '/User/Center/myRecommendTotalInfo',
		data: {
			pageType: pageTy
		}
	}, function(result) {
		$('#J-t-num').text(result.data.todayNum);
		$('#J-y-num').text(result.data.yestNum);
		$('#J-t-key').text('今日' + (pageTy == 1 ? '引荐人数' : '订单数'));
		$('#J-y-key').text('昨日' + (pageTy == 1 ? '引荐人数' : '订单数'));

		back && back();
	});
}

/**
 * 渲染列表
 * @return {[type]} [description]
 */
function rendList(back) {
	new Ajax().send({
		url: '/User/Center/myRecommendInfo',
		data: {
			pageType: pageTy,
			dayType: dayTy
		}
	}, function(result) {
		var list = result.data || [];

		$('#J-container-list').html(_tmplList['tmpl' + pageTy]({
			list: list
		}));

		back && back();
	});
}