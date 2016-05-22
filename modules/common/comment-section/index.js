var $ = require('zepto');
var Ajax = require('common/ajax/index');
var Preview = require('common/preview/index');
var PageLoader = require('common/page-loader/index');
var Util = require('common/util/index');
var Bubble = require('common/bubble/bubble');

var isInitSupport = false; //是否初始化过赞数据
var productId, productName;

var $discussList = $('#J-discuss-list');

/**
 * 初始化
 * @return {[type]} [description]
 */
function init(options) {
	options = options || {};
	productId = options.id || Util.getParam('g');
	productName = options.name || $('.item-title').text();

	addEvent();
	initPageLoader();
	initSupport();
}

/**
 * 添加事件监听
 */
function addEvent() {
	$('#J-support-btn').on('click', support);
	$discussList.on('click', '.img-list > li', previewImg);
	$discussList.on('click', '.yes-bar', discussSupport);
	$('#J-layer-btn').on('click', showLayer);
	$(document.body).on('click', function() {
		$('#J-layer-btn').parent().removeClass('show');
	});
}

function showLayer(evt) {
	evt.stopPropagation();

	var $parent = $(this).parent();

	if ($parent.hasClass('show')) {
		$parent.removeClass('show');
	} else {
		$parent.addClass('show');
	}
}

/**
 * 初始化分页
 * @return {[type]} [description]
 */
function initPageLoader() {
	new PageLoader({
		container: '#J-discuss-list',
		seeMore: '.see-more',
		getHtml: function(pageNum, back) {

			new Ajax().send({
				url: $('#J-ajaxurl-moreComment').val(),
				data: {
					g: productId,
					page: pageNum
				}
			}, function(result) {
				var list = result.commentlist.data;

				if (list.length == 0 && pageNum == 1) { //无数据
					$('#J-discuss-list').parent().addClass('empty');
				}

				if (pageNum == 1) { //初始化总评论数
					$('#J-discuss-amount').text(result.commentlist.total_num);
					resetLayer({
						canComment: result.commentlist.canComment,
						link: result.commentlist.commentUrl
					});
				}


				back && back(__inline('comment-item2.tmpl')({
					list: list
				}), result.commentlist.total_num);
			});


		}
	}).loadFirst().loadEnd(function() {
		$('.see-more').remove();
	});
}

function resetLayer(obj) {
	var $layer = $('#J-discuss-layer');

	if (obj.canComment == 1) { //可以评论
		$layer.find('.J-comment').attr('href', obj.link);
		$layer.css('display', 'block');
	}
}

/**
 * 初始化点赞相关数据
 * @return {[type]} [description]
 */
function initSupport() {
	new Ajax().send({
		url: $('#J-ajaxurl-initProductLikeData').val(),
		data: {
			g: productId
		}
	}, function(result) {
		var $btn = $('#J-support-btn');
		var $supportList = $('.support-list');

		isInitSupport = true;

		if (result.isSupport) {
			$btn.addClass('active');
		}
		$btn.find('.J-num').text(result.supportTotal);
		$supportList.html(__inline('support-item.tmpl')({
			list: result.supportList
		}));
		if (result.supportList.length > 0) {
			$supportList.css('display', 'block');
		}
	});
}

/**
 * 点赞
 * @return {[type]} [description]
 */
function support() {
	var $cur = $(this);
	var $num = $cur.find('.J-num');

	if (!isInitSupport) {
		return false;
	}
	if ($cur.hasClass('active')) {
		Bubble.show('您已赞过，不能重复点赞');
		return;
	}
	$cur.addClass('active');	
	$num.text(parseInt($num.text(), 10) + 1);
	new Ajax().send(Ajax.formatAjaxParams($cur), function(result) {
		if (result.headImg) {
			$('.support-list').prepend('<li style="background-image:url(' + result.headImg + ')"></li>').css('display', 'block');
		}
	});
}

/**
 * 评论点赞
 * @return {[type]} [description]
 */
function discussSupport() {
	var $cur = $(this);
	var $num = $cur.find('b');

	if ($cur.hasClass('active')) {
		return;
	}
	$cur.addClass('active');
	$num.text(+$num.text() + 1);
	new Ajax().send({
		url: '/Mall/Goods/setCommentLike',
		data: {
			id: $cur.attr('item-id')
		}
	}, function() {});
}

/**
 * 预览图片
 * @return {[type]} [description]
 */
function previewImg() {
	var $cur = $(this);
	var imgArr = [],
		curIndex = 0;

	$cur.parent().children().each(function(i, img) {
		if ($cur[0] == img) {
			curIndex = i;
		}
		imgArr.push($(img).css('background-image').match(/url\((.*)\)/)[1]);
	});
	Preview.show(imgArr, curIndex);
}

module.exports = {
	init: init
};