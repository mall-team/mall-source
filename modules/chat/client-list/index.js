var $ = require('zepto');
var Ajax = require('common/ajax/index');
var PageLoader = require('common/page-loader/index');
var Bubble = require('common/bubble/bubble');
var Util = require('common/util/index');
var Pop = require('common/pop/index');

var listType = Util.getParam('type') || 0;
var atten = Util.getParam('atten') || 0;
var $clientList = $('.client-list');

init();

function init() {
	initPageLoader();
	addEvent();
}

function addEvent() {
	$clientList.on('click', '.J-contact-him', showPop);
}

/**
 * 初始化分页
 * @return {[type]} [description]
 */
function initPageLoader() {
	var curPageNum = 1;
	var curList;

	new PageLoader({
		container: $clientList,
		seeMore: '.see-more',
		getHtml: function(pageNum, back) {
			curPageNum = pageNum;

			new Ajax().send({
				url: '/User/Customer/customerList',
				data: {
					type: listType,
					atten: atten,
					page: pageNum
				}
			}, function(result) {
				curList = result.list;
				back && back(__inline('item.tmpl')({
					list: curList,
					pageNum: pageNum
				}), +$('.atten-nav .active .amount').text());
			});


		}
	}).loadFirst().loadEnd(function() {
		if(curPageNum == 1 && curList.length == 0){ //无数据
			$clientList.html('<li class="nodata">暂无客户</li>')
		}
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

	if (listType == 2) { // 2代表准顾客，直接聊天
		// Bubble.show('此功能正在升级中，即将开放');
		// return;

		location.href = chartHref;
		return;
	}

	var _tmpl = __inline('contact.tmpl');

	Pop.show({
		autoY: true,
		content: _tmpl({
			chartHref: chartHref,
			tel: tel
		})
	});

	// $(document.body).on('click', '.J-chat-chat', function(evt){
	// 	evt.preventDefault();
	// 	Bubble.show('此功能正在升级中，即将开放');
	// 	return false;
	// });

}