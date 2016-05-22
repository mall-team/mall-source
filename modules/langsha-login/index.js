var $ = require('zepto');
var Alert = require('common/alert/alert');
var Ajax = require('common/ajax/index');
var LoginPop = require('common/login-pop/index');


var type = $(document.body).attr('alert');

switch (type) {
	case 'pay-suc':
		Alert.show($('#J-pay-suc').html(), false);
		break;
	case 'login-suc':
		Alert.show($('#J-register-suc').html());
		break;
}

LoginPop.init({
	Ajax: Ajax,
	loginSuc: function() {
		Alert.show($('#J-register-suc').html());
	}
});