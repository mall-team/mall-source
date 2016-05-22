
var Swiper = require('common/swiper/index');

var $fixPanel = $('.fix-panel');

new Swiper({
	container: 'banner',
	pager: 'bannerPager'
});


$fixPanel.on('click', '.close', function(){
	$fixPanel.remove();
	$(document.body).css('padding-bottom', '10px');
});