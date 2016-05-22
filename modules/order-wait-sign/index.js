var $ = require('zepto');
var Alert = require('common/alert/alert');
var Confirm = require('common/confirm/index');

var _soldTmpl = __inline('sold.tmpl')();

//售后
$('.J-sold-btn').on('click', function(){
	Alert.show(_soldTmpl);
});

//提醒发货
$('.J-remind-btn').on('click', function(){
	Confirm.show({
		msg: '提醒卖家发货成功，请耐心等待！',
		type: 'alert'
	})
});

/**
 * 确认发货
 */
require('common/j-ajax/index').init({
	// selfLoginSuc: function(){
	// 	location.reload();
	// }
});

