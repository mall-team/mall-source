var $ = require('zepto');
var Ajax = require('common/ajax/index');

start();

function start() {
	rendSendMoney();
	setTimeout(start, 5000);
}

function rendSendMoney(back) {
	new Ajax().send({
		url: '/Activity/Home/alreadySendRedPackage'
	}, function(result) {
		var $money = $('#J-send-money');

		if (result.redPackage != parseInt($money.text(), 10)) {
			$money.html(result.redPackage).addClass('money-ani');
			setTimeout(function() {
				$('#J-send-money').removeClass('money-ani');
			}, 1000);
		}
		back && back();
	});
}