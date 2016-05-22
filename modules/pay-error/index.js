
var $ = require('zepto');

$('#J-pay-types').on('click', 'li', function(evt){
	var $cur = $(this);
	var val = $cur.attr('value');

	$cur.siblings().removeClass('active');
	$cur.addClass('active');

	$('#J-radio').val(val);

});

// var Pop = require('common/pop/index');

// $('#J-test').on('click', function(){
// 	Pop.show('test');
// });