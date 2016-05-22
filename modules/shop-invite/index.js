var $ = require('zepto');
var Guide = require('common/guide/guide');
var Util = require('common/util/index');

init();

function init() {
	if (Util.getParam('tjz_from') == 'app') { //嵌入app时
		$('#J-invite-friend').on('click', function() {
			taojinzi.share(JSON.stringify({
				title: title,
				link: link,
				imgUrl: imgUrl,
				desc: desc,
				objectType: objectType,
				objectId: objectId,
				type: Util.getParam('type') || '1980'
			}));
		});
		return;
	}


	new Guide('#J-invite-friend');
	addEvent();
}

function addEvent() {

}