var $ = require('zepto');
var Timer = require('common/timer/timer');
var Util = require('common/util/index');


Util.phpdataReady(function(phpdata) {

	$('.J-timer').each(function(i, el) {
		new Timer(el, 'time').start().end(function() {
			// location.reload();
		});
	});
});

$('.section-item').on('click', function() {
	var $cur = $(this);
	var title = '';
	var actId = $cur.attr('act-id');
	var link = $cur.attr('act-link');
	var imgUrl = $cur.find('.img-wrap').css('background-image').match(/url\((.*)\)/)[1];
	var desc = '';
	var actType = $cur.attr('act-type');
	var type = 4;

	switch (actType) {
		case 'cut':
			title = '快来帮我砍价哇，我看中这个商品啦';
			desc = '【越砍越便宜】限时好货，价格砍到底。--淘金子';
			break;
		case 'group':
			title = '亲，这个商品太划算啦，一起来拼团购哟~';
			desc = '【底价拼团】抄底好货，拼团抢购。--淘金子';
			type = 5;
			break;
	}

	taojinzi.share(JSON.stringify({
		actId: actId,
		title: title,
		link: link,
		imgUrl: imgUrl,
		desc: desc,
		type: type
	}));
});