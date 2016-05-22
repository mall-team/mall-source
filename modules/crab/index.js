var $ = require('zepto');
var Timer = require('common/timer/timer');
var Util = require('common/util/index');


Util.phpdataReady(function(phpdata) {

	$('.J-timer').each(function(i, el) {
		new Timer(el, 'time').start().end(function() {
			// location.reload();
		});
	});
});