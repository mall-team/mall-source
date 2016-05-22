var $ = require('zepto');

var $container = $('#J-search-panel');
var $input = $container.find('input[type="search"]');
var $clear = $container.find('.icon-clear');
var isClearShow = false;
var isOpt = false; //是否操作过input框

if ($input.val()) {
	showClear();
}

$input.addClass('noOpt');

$clear.on('click', function() {
	$input.val('');
	hideClear();
});

$input.on('focus', function(){
	if(!isOpt){
		$input.val('').removeClass('noOpt');
		hideClear();
		isOpt = true;
	}
});

$input.on('input', function() {
	if ($input.val()) {
		if (isClearShow) {
			return;
		}

		showClear();
	} else {
		hideClear();
	}
});

function showClear() {
	isClearShow = true;
	$clear.css('display', 'block');
}

function hideClear() {
	isClearShow = false;
	$clear.css('display', 'none');
}