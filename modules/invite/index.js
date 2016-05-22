var $ = require('zepto');
var Ajax = require('common/ajax/index');

init();

function init() {
	getQRCode();
}

function getQRCode() {
	new Ajax().send({
		url: 'http://img.taojinzi.com/genqrcode.php',
		dataType: 'jsonp',
		data: {
			data: $('#J-qrcode-url').val(),
			logo: 1,
			size: 8
		}
	}, function(result) {
		$('#J-qrcode-img').html('<img src="' + result.url + '" />')
	});
}