var $ = require('zepto');
var Alert = require('common/alert/alert');
var Bubble = require('common/bubble/bubble');

window.Bubble = Bubble;

var $btn = $('#J-register')

$btn.on('click', function(evt) {
	var url = $btn.attr('alert');

	if (url) {
		Alert.show(url);
	}
	evt.preventDefault();
});