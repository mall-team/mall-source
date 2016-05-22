var $ = require('zepto');
var Ajax = require('common/ajax/index');
var Bubble = require('common/bubble/bubble');
var JAjax = require('common/j-ajax/index');
var lrz = require('common/lrz/index');
var Preview = require('common/preview/index');
var JDisabled = require('common/j-disabled/index');
var Copyright = require('common/copyright/index');

var $area = $('#J-area');
var $phone = $('#J-phone');
var $uploaderList = $('#J-uploader-list');

var hasExtra = false; //是否超长过


init();

function init() {
	addEvent();

	initJAjax();
	JDisabled.init();
	// initArea();
}

function addEvent() {
	$('#J-file-input').on('change', selPic);
	$uploaderList.on('click', '.item-preview .img-wrap', showPreview);
	$uploaderList.on('click', '.J-close', delPic);

	$('.J-star-bar').on('click', star);
}

/**
 * 评价星级
 * @return {[type]} [description]
 */
function star(evt) {
	var $cur = $(this);
	var eveWid = $cur.width() / 5;
	var num = Math.ceil(evt.layerX / eveWid);

	if (num == 0) {
		num = 1;
	}

	$cur.find('.star-inner').width(num * eveWid);
	$('#J-score-input').val(num);
}

/**
 * 初始化jajax
 * @return {[type]} [description]
 */
function initJAjax() {
	JAjax.init({
		validateFunc: function() {
			if (!$area.val()) {
				Bubble.show('请输入你的建议');
				return false;
			}
			// if(!$phone.val()){
			// 	Bubble.show('请输入你的手机号');
			// 	return false;
			// }
			return true;
		}
	});
}

/**
 * 初始化textarea
 * @return {[type]} [description]
 */
function initArea() {
	$area.on('input propertychange', function() {
		var len = $(this).val().length;
		var $num = $('#J-num');

		$num.text(len);

		if (len > 200) {
			hasExtra = true;
			$num.addClass('extra');
		} else {
			if (hasExtra) {
				$num.removeClass('extra');
			}
		}
	});
}

/**
 * 上传图片
 * @return {[type]} [description]
 */
function selPic() {
	var $uplaoder = $(this).parent();
	var $curItem = $uplaoder.parent('.item');
	var files = this.files;
	var len = files.length,
		index = 0;

	uploading = true;
	$uplaoder.addClass('loading');

	upload();

	function upload() {
		lrz(files[index], {
			width: 500
		}).then(function(rst) {
			new Ajax().send({
				url: $('#J-uploader-url').val(),
				type: 'post',
				data: {
					image: rst.base64,
					size: rst.base64Len
				}
			}, function(result) {

				var result = result || {
					url: ''
				};

				if (len - 1 <= index || index >= 8) {
					uploading = false;
					files = null;
					Copyright.reset();
				} else {
					upload();
				}
				index++;
				$uplaoder.removeClass('loading');
				$curItem.before('<div class="item item-preview">\
								<div class="J-close close"></div>\
								<div class="img-wrap item-inner" style="background-image:url(' + result.url + ')"></div>\
								<input type="hidden" name="imgUrl[]" value="' + result.url + '" />\
							</div>');

				if ($uploaderList.children().length > 9) {
					$curItem.css('display', 'none');
				}
			});
			return rst;
		}).catch(function(err) {});


	}

}

/**
 * 预览
 * @return {[type]} [description]
 */
function showPreview() {
	var $el = $(this);
	var imgArr = [],
		curIndex = 0;

	$uploaderList.find('.item-preview .img-wrap').each(function(i, img) {
		if ($el[0] == img) {
			curIndex = i;
		}
		imgArr.push($(img).css('background-image').match(/url\((.*)\)/)[1]);
	});
	Preview.show(imgArr, curIndex);
}

/**
 * 删除图片
 * @return {[type]} [description]
 */
function delPic(evt) {
	evt.stopPropagation();

	var $cur = $(this);
	$cur.parent('.item').remove();
	$uploaderList.children('.item-upload').css('display', 'block');
}