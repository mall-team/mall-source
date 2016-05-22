var $ = require('zepto');
var Ajax = require('common/ajax/index');
var LoginPop = require('common/login-pop/index');


init();

function init() {
	if ($(document.body).attr('is-login') == 0) {
		LoginPop.show({
			Ajax: Ajax,
			manualClose: false,
			noSelRecommend: true,
			loginSuc: function() {
				location.reload();
			}
		});
	}

	addEvent();
}

function addEvent() {
	$('a[recommend]').on('click', selRecommend);
}

/**
 * 选择推荐人
 * @return {[type]} [description]
 */
function selRecommend(evt) {
	evt.preventDefault();

	var $link = $(this);

	recordLog($link.attr('recommend'), function() {
		location.href = $link.attr('href');
	});
}


/**
 * 记录推荐选择
 * @return {[type]} [description]
 */
function recordLog(recommend, back) {
	var recommendLog = {
		type: 3,
		phone: phpdata.phone,
		userList: JSON.parse(phpdata.userList),
		recommend: recommend
	};

	new Ajax().send({
		url: '/User/Register/selectRecommendLog',
		type: 'post',
		data: {
			data: JSON.stringify(recommendLog)
		}
	}, function(result) {
		back && back();
	}, function() {
		back && back();
	});
}