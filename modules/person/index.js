var $ = require('zepto');
var Ajax = require('common/ajax/index');
var Pop = require('common/pop/index');
var Nav = require('common/nav/index');

init();

function init() {
	Nav.initCart();
	addEvent();
}

function addEvent() {
	$('#J-exit').on('click', exit);
	$('#J-other').on('click', showOther);
}

/**
 * 切换帐号
 * @return {[type]} [description]
 */
function exit() {
	new Ajax().send({
		url: '/User/Login/logout'
	});
	return false;
}

/**
 * 显示其它
 * @return {[type]} [description]
 */
function showOther(){
	Pop.show({
		title: '其它',
		content: $('#J-other-tmpl').html()
	})

	return false;
}