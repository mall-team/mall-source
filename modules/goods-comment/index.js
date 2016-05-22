var $ = require('zepto');
var Ajax = require('common/ajax/index');
var PageLoader = require('common/page-loader/index');
var Bubble = require('common/bubble/bubble');
var Preview = require('common/preview/index');

var lastPageNum = 1;
var curDataLen = 0;

init();

function init() {
	addEvent();
	initPage();
}

function addEvent(){
	$('#J-discuss-list').on('click', '.img-list > li', previewImg);
}

function initPage() {
	new PageLoader({
		container: '#J-discuss-list',
		getHtml: function(pageNum, back) {

			lastPageNum = pageNum;

			new Ajax().send({
				url: '/Mall/Goods/moreComment',
				data: {
					g: getParam('g'),
					page: pageNum,
					type: 1
				}
			}, function(result) {
				var list = result.commentlist.data;

				if (list) {
					curDataLen = list.length;
				}
				back && back(__inline('../common/comment-section/comment-item2.tmpl')({
					list: list
				}), result.commentlist.total_num);
			});


		}
	}).loadFirst().loadEnd(function() {
		// $('.see-more').remove();
		if (lastPageNum > 1) {
			Bubble.show('亲，没有评价了~');
		} else {
			if (curDataLen == 0) {
				$('#J-discuss-list').css('display', 'none');
				$('#J-nodata').css('display', 'block');
			}

		}
	});

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