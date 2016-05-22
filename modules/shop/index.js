var $ = require('zepto');
var Swiper = require('common/swiper/index');
var Alert = require('common/alert/alert');
var Bubble = require('common/bubble/bubble');
var Ajax = require('common/ajax/index');
var LoginPop = require('common/login-pop/index');
var RecommendAlert = require('recommend-alert/index');
var Util = require('common/util/index');

window.Bubble = Bubble;

// phpdata = {
// 	isLogin: 0
// };

var toUrl;

new Swiper({
	container: 'banner',
	pager: 'bannerPager'
});


$('#J-shop, #J-fenxiao').on('click', function(evt) {
	evt.preventDefault();

	var fromSrc = Util.getParam('from_src');

	if(!fromSrc || fromSrc != 'app'){
		Alert.show(__inline('tip.tmpl')(), true, 'shop-tip-alert');
		return false;
	}

	var $btn = $(this);
	var isLogin = phpdata.isLogin;
	var msg = $btn.attr('alert-msg');

	toUrl = $btn.attr('href');

	if (msg) {
		Alert.show(msg);
		return false;
	}
	if (isLogin == 0) {
		LoginPop.show({
			Ajax: Ajax,
			loginSuc: function() {
				confirmService();
			}
		});
		return false;
	}

	confirmService();
	return false;
});

/**
 * 确认服务人
 * @return {[type]} [description]
 */
function confirmService() {
	new Ajax().send({
		url: '/User/ApplyShop/confirmServiceInfo'
	}, function(result) {
		RecommendAlert.confirm({
			noLimit: true, //没有次数限制
			isShop: true,
			result: result,
			success: function(){
				location.href = toUrl;
			}
		});
	});


}


var Confirm = require('common/confirm/index');

var $body = $(document.body);
var url = $body.attr('alert');
var msg = $body.attr('alert-msg');

if (url) {
	Alert.show(url);
} else if (msg) {
	Confirm.show({
		msg: msg,
		type: 'alert',
		yesBack: function() {
			// window.history.back();
		}
	});
}