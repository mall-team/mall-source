var $ = require('zepto');
var Address = require('common/address/index');

init();

function init(){
	Address.initPage({
		container: '#J-address-section'
	});
}

