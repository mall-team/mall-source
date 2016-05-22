var $ = require('zepto');
var Tabs = require('common/tabs/index');
var Ajax = require('common/ajax/index');
var PageLoader = require('common/page-loader/index');
var FixTop = require('common/fix-top/index');
var Bubble = require('common/bubble/bubble');
var Copyright = require('common/copyright/index');
var Alert = require('common/alert/alert');

$('#J-score-rule').on('click', showRule);

new FixTop({
	el: '.wallet-detail .nav'
});

new Tabs({
	nav: '.nav li',
	content: '.detail-list',
	switchBack: function(){
		Copyright.reset();
	}
});

Copyright.reset();

new PageLoader({
	container: '#J-bill-all',
	pageBegin: 2,
	getHtml: function(pageNum, back) {

		new Ajax().send({
			url: '/User/Center/scoreList',
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
	Bubble.show('亲，没有更多钱包数据了~');
});

new PageLoader({
	container: '#J-bill-out',
	pageBegin: 2,
	getHtml: function(pageNum, back) {

		new Ajax().send({
			url: '/User/Center/scoreList',
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
	Bubble.show('亲，没有更多钱包数据了~');
});

new PageLoader({
	container: '#J-bill-in',
	pageBegin: 2,
	getHtml: function(pageNum, back) {

		new Ajax().send({
			url: '/User/Center/scoreList',
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
	Bubble.show('亲，没有更多钱包数据了~');
});

/**
 * 显示积分规则
 * @return {[type]} [description]
 */
function showRule(){
	Alert.show(__inline('rule.tmpl')(), true, 'score-rule-alert');
}


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