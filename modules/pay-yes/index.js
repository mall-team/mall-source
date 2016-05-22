
var $ = require('zepto');

$('#J-pay-way').on('click', 'li', function(evt){
	var $cur = $(this);
	var val = $cur.attr('value');

	$cur.siblings().removeClass('active');
	$cur.addClass('active');

	$('#J-radio').val(val);

});