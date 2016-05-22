var $ = require('zepto');
var Ajax = require('common/ajax/index');
var Alert = require('common/alert/alert');

var tmpl = __inline('index.tmpl')();


function render() {
	new Ajax().send({
		url: '/Activity/DanPin/showActivity'
	}, function(result) {
		if (result.isShow) {

			Alert.show(tmpl, true, 'klj-alert-content');
			
		}
	});
}


module.exports = {
	render: render
};