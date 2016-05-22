var Swiper = require('common/swiper/index');
var Guide = require('common/guide/guide');
var Util = require('common/util/index');

require('common/ad-layer/index');

// if(typeof phpdata === 'undefined'){
// 	phpdata = {};
// }

// Util.phpdataReady(function(){
var $share = $('#J-share');

new Swiper({
	container: 'banner',
	pager: 'bannerPager'
});


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
// });


require('common/j-ajax/index').init({
	selfLoginSuc: function() {
		location.reload();
	}
});