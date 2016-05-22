var $ = require('zepto');
var Guide = require('common/guide/guide');

var NUM = 10;
var $see = $('.see-more');
var $rankList = $('.rank-list');

$see.on('click', function() {
	$('.rank-list').css({
		'height': 'auto'
	});

	$see.off('click');
	$see.css('display', 'none');
});


new Guide('#J-share');


$('#J-refresh').on('click', function(){
	location.reload();
})

initRankHei();

function initRankHei() {
	if ($rankList.children().length > NUM) {
		$see.css('display', 'block');
		resetHei($rankList);
	} else {
		$rankList.css('height', 'auto');
	}
}

function resetHei($list) {
	// var winWid = $(window).width();

	$list.height($($list.children()[0]).height() * NUM + 17 * (NUM - 1) + 20 + 10);

}