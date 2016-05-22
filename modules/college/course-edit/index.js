var $ = require('zepto');

var $setPwd = $('#J-set-pwd');
var $input = $('#J-pwd-input');

$setPwd.on('change', function() {
	$input.css('display', $setPwd[0].checked ? 'block' : 'none');
});