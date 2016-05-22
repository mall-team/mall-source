var Alert = require('common/alert/alert');
var Bubble = require('common/bubble/bubble');
var Guide = require('common/guide/guide');

var url = document.body.getAttribute('alert');

window.Bubble = Bubble;

if(url){
	Alert.show(url);
}

new Guide('#J-share-order');

checkCoupon();

/**
 * 检查是否有优惠券可领
 * @return {[type]} [description]
 */
function checkCoupon(){
	var hasCoupon = $('#J-has-coupon').val() == 1;

	if(hasCoupon){
		Alert.show(__inline('alert.tmpl')({
			title: '手气不错哦',
			msg: '共有1张优惠券可领',
			order: $('#J-order').text()
		}), true, 'coupon-rain-alert');
	}
}