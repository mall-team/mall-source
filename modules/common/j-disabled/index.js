var $ = require('zepto');

function init() {
	$('.j-disabled').each(function(i, el) {
		var $el = $(el);
		var forever = $el.attr('disabled-forever'); //是否永久禁用，默认5s后自动可用
		var timer;

		$el.on('touchstart', function(evt) {
			if ($el.hasClass('disabled')) {
				evt.preventDefault();
				evt.stopPropagation();
				return false;
			}
		});

		$el.on('disabled:click', function() {

			if (!$el.hasClass('disabled')) {
				$el.addClass('disabled');

				if (!forever || forever != 1) {
					timer = setTimeout(function() {
						$el.removeClass('disabled');
					}, 5000);
				}
			}
		});

		$el.on('disabled:ok', function() {
			clearTimeout(timer);
			$el.removeClass('disabled');
		});
	});
}


module.exports = {
	init: init
};