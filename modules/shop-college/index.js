var $ = require('zepto');
var Alert = require('common/alert/alert');
var Ajax = require('common/ajax/index');
var LoginPop = require('common/login-pop/index');

phpdata = {
	isLogin: 0
}

$('#J-shop').on('click', function(evt) {
	var $btn = $(this);
	// var login = $btn.attr('login');
	var isLogin = phpdata.isLogin;
	var msg = $btn.attr('alert-msg');

	if(msg){
		Alert.show(msg);
		return false;
	}
	if(isLogin == 0){
		LoginPop.show({
			Ajax: Ajax,
			loginSuc: function(){
				location.href = $btn.attr('href');
			}
		});
		return false;
	}
});