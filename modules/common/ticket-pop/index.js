var $ = require('zepto');
var Pop = require('common/pop/index');
var Ajax = require('common/ajax/index');

var curOptions;
var ticketList;
var $curContainer;

function show(options) {
	curOptions = options || {};

	new Ajax().send({
		url: curOptions.ajaxUrl,
		data: curOptions.ajaxParams || {}
	}, function(result) {
		var list = result.list;

		Pop.show({
			title: '选择优惠券',
			content: __inline('index.tmpl')({
				list: (ticketList = list),
				curId: curOptions.curId || 0
			})
		});

		$curContainer = $('.ticket-container');

		$curContainer.on('click', '.radio', sel);
	});
}

function sel() {
	var $cur = $(this);
	var ticketItem = $cur.attr('ticket-item');

	$curContainer.find('.radio.selected').removeClass('selected');
	$cur.addClass('selected');
	Pop.hide();
	curOptions.selected && curOptions.selected(ticketItem != -1 ? JSON.parse(ticketItem) : -1, ticketList.length);
}


module.exports = {
	show: show
};