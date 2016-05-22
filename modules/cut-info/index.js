var TAP_EVENT = 'click';
var $ = require('zepto');
var PageLoader = require('common/page-loader/index');

require('common/j-ajax/index').init();
var Util = require('common/util/index');

require('common/ad-layer/index');

function Tab(el) {
	var $el = this.$el = $(el);

	this.order = 0;

	this.$navs = $el.find('.tab-nav').children();
	this.$items = $el.find('.tab-content').children();
	this._init();
}

Tab.prototype = {
	_init: function() {
		var self = this;
		var rankType = Util.getParam('rankType') || 0;

		self._toActive(self.$navs.get(rankType));

		self.$navs.on('click', function(evt) {
			self._toActive($(evt.target));
		});

	},

	_toActive: function($cur) {
		$cur = $($cur);

		var self = this;
		var order = self._getOrder($cur, self.$navs);
		var curItem = $(self.$items[order]);

		self.order = order;

		self.$navs.removeClass('active');
		$cur.addClass('active');
		self.$items.css('display', 'none');
		curItem.css('display', 'block');
	},

	_getOrder: function(ele, list) {
		var i = 0,
			len = list.length;
		var cur = ele[0];

		for (; i < len; i++) {
			if (list[i] == cur) {
				return i;
			}
		}
	}
};

new Tab('#J-tab');

var Guide = require('common/guide/guide');
var Timer = require('common/timer/timer');

// Util.phpdataReady(function() {

if (typeof taojinzi === 'undefined') {
	new Guide('#J-invite');
	$('[invite]').each(function(i, el) {
		new Guide(el);
	});
} else {
	$('#J-invite').add($('[invite]')).on('click', function() {
		taojinzi.share(JSON.stringify({
			title: title,
			link: link,
			imgUrl: imgUrl,
			desc: desc
		}));
	});
}
// });

new Timer('#J-timer').start().end(function() {
	location.reload();
});

var Confirm = require('common/confirm/index');
var $body = $(document.body);
var bodyMsg = $body.attr('alert');
var bodyTo;

if (bodyMsg) {
	bodyTo = $body.attr('alert-to');

	Confirm.show({
		type: 'alert',
		msg: bodyMsg,
		yesBack: function() {
			if (bodyTo) {
				location.href = bodyTo;
			}
		}
	});

}


var Ajax = require('common/ajax/index');
var Bubble = require('common/bubble/bubble');
var Util = require('common/util/index');
var Config = require('common/config/index');
var Confirm = require('common/confirm/index');
var Alert = require('common/alert/alert');

$('#J-help-cut').on(TAP_EVENT, function(evt) {
	evt.preventDefault();
	cut();
});

$('#J-cut').on(TAP_EVENT, function(evt) {
	evt.preventDefault();
	cut();
});

$('[bubble]').each(function(i, el) {
	var $el = $(el);
	var msg = $el.attr('bubble');

	if (msg) {
		$el.on(TAP_EVENT, function() {
			Bubble.show(msg);
		});
	}
});


function cut() {
	var $form = $('form');
	var url = $form.attr('action');
	var data = $form.serialize();

	new Ajax().send({
		url: url,
		data: data,
		type: 'post',
		selfSucBack: true,
		selfLoginSuc: function() {
			location.reload();
		}
	}, function(result, data) {
		var txt = Config.cutArr[Util.random(0, 11) - 1];

		Confirm.show({
			msg: txt.replace('$0', '<b style="color: #ea0079;">' + result.price + '</b>'),
			type: 'alert',
			yesBack: function() {
				if (typeof phpdata != 'undefined' && phpdata.redPackage) {
					// showQrcode(function() {
					// 	location.href = data.url;
					// });
					showRedPacket(function() {
						location.href = data.url;
					});
				} else {
					location.href = data.url;
				}
			}
		})
	});
}

// showRedPacket();

/**
 * 显示红包
 */
function showRedPacket(closeBack) {
	var tmpl = __inline('red-packet.tmpl');

	phpdata.isTjz = !phpdata.ownerHead && !phpdata.ownerName;

	Alert.show(tmpl(phpdata), false, 'alert-red-packet');
	$('.packet-close').on('click', function() {
		Alert.hide();
		closeBack && closeBack();
	})
}

// showQrcode(function() {
// 	location.href = 'http://www.baidu.com';
// });

function showQrcode(closeBack) {
	Alert.show(__inline('qrcode.tmpl')(phpdata), true, 'alert-qrcode-alert');
	$('#J-alert-close').on('click', function() {
		closeBack && closeBack();
	});
}


// var NUM = 10;

// $('.content-item').each(function(i, el) {
// 	var $el = $(el);
// 	var $more = $el.find('.see-more');
// 	var $list = $el.find('.record-list');
// 	var $childs;

// 	if ($list.children().length > NUM) {
// 		$more.css('display', 'block');
// 		resetHei($list);
// 	} else {
// 		$list.css('height', 'auto');
// 	}

// 	$more.on('click', function() {
// 		$list.css('height', 'auto');
// 		$more.css('display', 'none');
// 	});

// });

// function resetHei($list) {
// 	var winWid = $(window).width();

// 	$list.height(80 / 640 * winWid * NUM + 14 * NUM + 7);

// }

var $recordList = $('.record-list');
var $more = $('.see-more');
var $load = $('.J-more-loading');
var _tmplArr = {
	tmpl0: __inline('rank-item0.tmpl'),
	tmpl1: __inline('rank-item1.tmpl')
};

$recordList.each(function(i) {
	var url, params = {};

	switch (i) {
		case 0:
			url = '/Mall/Haggle/haggleSortByPrice'
			break;
		case 1:
			url = '/Mall/Haggle/haggleSortForOwnerId'
			break;
	}

	params.activeId = Util.getParam('haggleId');
	params.ownerId = Util.getParam('ownerId');

	new PageLoader({
		container: $recordList[i],
		seeMore: $more[i],
		pageBegin: 2,
		loading: $load[i],
		getHtml: function(pageNum, back) {
			params.page = pageNum;

			new Ajax().send({
				url: url,
				data: params
			}, function(result) {
				back && back(_tmplArr['tmpl' + i]({
					list: result,
					params: params
				}));
			});


		}
	}).loadEnd(function() {
		$($more[i]).remove();
	});
});