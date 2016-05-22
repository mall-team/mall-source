var Guide = require('common/guide/guide');
var Timer = require('common/timer/timer');
require('common/j-ajax/index').init();

// if(typeof phpdata === 'undefined'){
// 	phpdata = {};
// }

// Util.phpdataReady(function(){
var $share = $('#J-btn-invite');

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


new Timer('#J-timer').start().end(function() {});