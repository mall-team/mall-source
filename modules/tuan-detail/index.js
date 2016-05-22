var TAP_EVENT = 'click';

var $ = require('zepto');
var Guide = require('common/guide/guide');
var Swiper = require('common/swiper/index');
var Util = require('common/util/index');

new Swiper({
	container: 'banner',
	pager: 'bannerPager'
});

Util.phpdataReady(function(){
	var $share = $('#J-share');

	if (typeof taojinzi === 'undefined') {
		new Guide($share);
	} else {
		$share.on('click', function() {
			taojinzi.share(JSON.stringify({
				title: title,
				link: link,
				imgUrl: imgUrl,
				desc: desc
			}));
		});
	}
});

require('common/j-ajax/index').init({
	selfLoginSuc: function(){
		location.reload();
	}
});
