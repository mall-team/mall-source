var $ = require('zepto');
var Ajax = require('common/ajax/index');
var Bubble = require('common/bubble/bubble');
var PageLoader = require('common/page-loader/index');

new PageLoader({
	container: '.act-list',
	pageBegin: 2,
	getHtml: function(pageNum, back) {
		new Ajax().send({
			url: ($(document.body).attr('pageurl')),
			data: {
				page: pageNum
			}
		}, function(result) {
			back && back(__inline('item.tmpl')({
				list: result.actlist
			}));
		});


	}
}).loadEnd(function() {
	Bubble.show('亲，没有更多活动数据了~');
});
