var $ = require('zepto');
var RecommendAlert = require('recommend-alert/index');
var Pop = require('common/pop/index');


init();

function init(){
	addEvent();
}

function addEvent(){
	$('#J-modify-btn').on('click', modify);
	$('#J-contact-btn').on('click', showPop);
}

/**
 * 修改服务人
 * @return {[type]} [description]
 */
function modify(){
	RecommendAlert.modify();
}

/**
 * 显示电话、短信浮层
 * @return {[type]} [description]
 */
function showPop() {
	var $cur = $(this);
	var tel = $cur.attr('phone');
	var _tmpl = __inline('contact.tmpl');

	if(!tel){
		return;
	}
	Pop.show({
		content: _tmpl({
			tel: tel
		})
	});
}