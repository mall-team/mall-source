
/**
 * 初始化
 */
function init(){
	initBtn();
	initFastClick();
	initCopyright();
}


/**
 * 解决按钮两态bug
 */
function initBtn(){
	var $ = require('zepto');
	$('.btn').on('touchstart', function() {});
}

/**
 * fastclick支持
 */
function initFastClick(){
	var $ = require('zepto');
	var noFast = $('body').attr('no-fastclick');
	var FastClick = require('fastclick');

	if(!noFast){
		FastClick(document.body);
	}
}

/**
 * 控制页面底部copyright
 */
function initCopyright(){
	require('common/copyright/index').render();
}


init();