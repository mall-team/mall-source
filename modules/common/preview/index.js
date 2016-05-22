var $ = require('zepto');
var Swiper = require('common/swiper/index');

var _tmpl = __inline('index.tmpl');
var $el, $close;
var S;


function show(imgArr, i) {
	var index = i || 0;

	$(document.body).append($el = $(_tmpl({
		imgArr: imgArr
	})));
	$close = $el.find('.preview-close');
	
	$close.on('click', close);

	S = new Swiper({
		container: $el.find('.J-banner'),
		pager: $el.find('.J-bannerPager'),
		swipeOptions: {
			auto: 0,
			continuous: false,
			startSlide: index
		}
	});

}

function close() {
	S.swipe.kill();
	$el.remove();
}

module.exports = {
	show: show
};