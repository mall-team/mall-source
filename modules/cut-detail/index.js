var TAP_EVENT = 'click';

var $ = require('zepto');
var Guide = require('common/guide/guide');
var Swiper = require('common/swiper/index');
var Util = require('common/util/index');

require('common/j-ajax/index').init();
require('common/ad-layer/index');

// Util.phpdataReady(function() {

new Swiper({
	container: 'banner',
	pager: 'bannerPager'
});

if (typeof taojinzi === 'undefined') {
	new Guide('#J-share');
	new Guide('#J-invite');
} else {
	$('#J-share').add($('#J-invite')).on('click', function() {
		taojinzi.share(JSON.stringify({
			title: title,
			link: link,
			imgUrl: imgUrl,
			desc: desc
		}));
	});
}
// });


var Ajax = require('common/ajax/index');
var Bubble = require('common/bubble/bubble');
var Util = require('common/util/index');
var Config = require('common/config/index');

$('#J-help-cut').on(TAP_EVENT, function(evt) {
	cut();
	evt.preventDefault();
});

$('#J-cut').on(TAP_EVENT, function(evt) {
	cut();
	evt.preventDefault();
});

$('[bubble]').each(function(i, el) {
	var $el = $(el);
	var msg = $el.attr('bubble');

	if (msg) {
		$el.on(TAP_EVENT, function() {
			Bubble.show(msg);
		});
	}
});

function cut() {
	var $form = $('form');
	var url = $form.attr('action');
	var data = $form.serialize();

	new Ajax().send({
		url: url,
		data: data,
		type: 'post',
		selfBack: true,
		selfLoginSuc: function() {
			location.reload();
		}
	}, function(data) {
		if (data.code == 0) {
			var txt = Config.cutArr[Util.random(0, 11) - 1];
			Bubble.show(txt.replace('$0', data.result.price), 2000);
			setTimeout(function() {
				location.href = data.url;
			}, 2500)
		} else {
			if (data.msg) {
				Bubble.show(data.msg);
				if (!data.url) {
					return;
				}
				setTimeout(function() {
					location.href = data.url;
				}, 2000)
			}
		}
	});

}