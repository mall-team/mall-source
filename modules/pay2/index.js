var $ = require('zepto');

// var totalVal = +$('#J-total-val').val() + (+$('#J-trans-val').val()); //消费金额 + 运费
var lastVal = +$('#J-last-val').val(); //帐户余额

var $moneyLast = $('.money-last');
var $payType = $('.pay-types > li');
var $useLastInput = $('#J-use-last');
var $payTypeInput = $('#J-pay-type')

function init() {
	initLastMoney();
	addEvent();
}

function addEvent() {

	$payType.on('click', function() {
		var $cur = $(this);

		if ($cur.hasClass('active')) {
			return;
		}
		$payType.removeClass('active');
		$cur.addClass('active');
		$payTypeInput.val($cur.attr('value'));

		// if (lastVal > totalVal) { //单选
		// 	$moneyLast.removeClass('selected');
		// 	$useLastInput.val(1);
		// }

	});

}


function initLastMoney() {
	if (lastVal == 0) {
		$moneyLast.addClass('disabled');
	} else {
		$moneyLast.addClass('usable').on('click', function() {
			var $cur = $(this);

			if ($cur.hasClass('selected')) { //不用余额
				$cur.removeClass('selected');
				$useLastInput.val(0);
			} else {
				$cur.addClass('selected');
				$useLastInput.val(1);

				// if (lastVal >= totalVal) { //单选
				// 	$payType.removeClass('active');
				// 	$payTypeInput.val(0);
				// }

			}


		});

	}
}

init();