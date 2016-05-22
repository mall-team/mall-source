var $ = require('zepto');
var _tmpl = __inline('index.tmpl');

var $layer, $mask, $close;


function init() {
	window.shareSuccess = show;
}

function show(obj) {
	obj = obj || {
		link: ''
	};

	obj.hasMask = ($('#J-guide').length == 0);

	$(document.body).append($(_tmpl(obj)));

	$layer = $('#J-ad-layer');
	$mask = $layer.find('.mask');
	$close = $layer.find('.close');

	$close.on('click', close);
	$mask.on('click', close);
}

function close() {
	$layer.remove();
	return false;
}



init();