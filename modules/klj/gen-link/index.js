var $ = require('zepto');
var Bubble = require('common/bubble/bubble');
var Ajax = require('common/ajax/index');

init();

function init() {
	addEvent();
}

function addEvent() {
	$('#J-gen-link').on('click', genLink);
	$('#J-url-text').on('touchstart', function(){
		$('#J-phone-num').blur();
	});
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