var TAP_EVENT = 'click';
var $ = require('zepto');
var Ajax = require('common/ajax/index');
var Confirm = require('common/confirm/index');

var validateFunc;

function init(options) {

	options = options || {};
	validateFunc = options.validateFunc;

	$('.j-ajax').each(function(i, el) {
		var $el = $(el);
		var $form = $('#' + $el.attr('form'));
		var url, type, data;
		var alert = $el.attr('alert');
		var alertTo = $el.attr('alert-to');


		$el.on(TAP_EVENT, function(evt) {
			if(validateFunc && !validateFunc()){
				return false;
			}

			$el.trigger('disabled:click');

			if ($form.length > 0) {
				url = $form.attr('action');
				type = $form.attr('method');
				data = $form.serialize();
			} else {
				url = $el.attr('ajax-url');
				type = $el.attr('ajax-type') || 'get';
				data = JSON.parse($el.attr('ajax-data'));
			}

			var requestObj = {
				url: url,
				type: type,
				data: data,
				selfLoginSuc: options.selfLoginSuc
			};
			
			new Ajax().send(requestObj, function() {
				if (alert) {
					Confirm.show({
						msg: alert,
						type: 'alert',
						yesBack: function() {
							if (alertTo) {
								location.href = alertTo;
							}
						}
					});
				}
			}, function(){
				$el.trigger('disabled:ok');
			});

			evt.preventDefault();
		});

	});

}

module.exports = {
	init: init
};