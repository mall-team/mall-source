var $ = require('zepto');
var Alert = require('common/alert/alert');

var _tmpl = __inline('index.tmpl');
var $confirm, $content, $yes, $no;


function show(options) {

	Alert.show(_tmpl({
		msg: options.msg,
		type: options.type,
		okLabel: options.okLabel,
		noLabel: options.noLabel
	}), false);
	$confirm = $('#J-confirm');
	$content = $confirm.find('.confirm-content');
	$yes = $confirm.find('.btn-yes');
	$no = $confirm.find('.btn-no');

	$yes.on('click', function(){
		hide();
		options.yesBack && options.yesBack();
	});

	$no.on('click', function(){
		hide();
		options.noBack && options.noBack();
	});

}

function hide() {
	Alert.hide();
	$yes.off('click');
	$no.off('click');
}

module.exports = {
	show: show,
	hide: hide
};