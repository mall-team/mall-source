var $ = require('zepto');
var Timer = require('common/timer/timer');
var Ajax = require('common/ajax/index');
var PageLoader = require('common/page-loader/index');
var Bubble = require('common/bubble/bubble');


function renderTimer($timerList) {
	$timerList.each(function(i, item) {

		new Timer($(item), function(time) {
			var minute = parseInt(time / 60, 10);
			var sec = time - minute * 60;
			return Timer.addZero(minute) + ':' + Timer.addZero(sec);
		}).start();

	});
}

renderTimer($('[timer]'));


var orderType = $('body').attr('order-type');
var ajaxUrl, itemLink;

ajaxUrl = $('#J-ajaxurl-list').val();
itemLink = $('#J-detail-prefix').val();

new PageLoader({
	container: '.order-list',
	pageBegin: 2,
	getHtml: function(pageNum, back) {

		new Ajax().send({
			url: ajaxUrl,
			data: {
				page: pageNum
			}
		}, function(result) {
			back && back(__inline('item.tmpl')({
				list: result.orderList,
				pageNum: pageNum
			}));
			if (orderType == 'pay-wait') {
				renderTimer($('.J-timer-' + pageNum));
			}
		})

	}
}).loadEnd(function() {
	Bubble.show('亲，没有更多订单了~');
});