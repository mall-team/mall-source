var $ = require('zepto');
var Address = require('common/address/index');

var $address = $('#J-address');


function init() {
	if ($address.hasClass('no-address')) {
		showAddr();
	}

	$address.on('click', showAddr);
}

function showAddr() {
	Address.show({
		selected: function(item) {
			if (item && item.recipient_name) {
				$address.find('.user-name').text(item.recipient_name);
				$address.find('.tel').text(item.recipient_phone);
				$address.find('.addr-addr').text(item.province_name + item.city_name + item.region_name + item.recipient_address);
				$address.removeClass('no-address');
				$('#J-addr-id').val(item.id);
			} else {
				$('#J-address').addClass('no-address');
			}
		}
	});
}

init();