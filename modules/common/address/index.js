var $ = require('zepto');
// var _ = require('underscore');
var Pop = require('common/pop/index');
var Ajax = require('common/ajax/index');
var Bubble = require('common/bubble/bubble');
var AddrSel = require('common/addr-sel/index');
var Confirm = require('common/confirm/index');

var listTmpl = __inline('list.tmpl');
var editTmpl = __inline('edit.tmpl');

// var listData = [1, 2, 3, 4];
var listData = null;
var curAddr = {};

var $container, $radios, $addBtn, $addrList;
var $editContainer, $saveBtn, $delBtn;
var curItem = {}; //当前编辑地址

var selected;
var $pageContent;
var curType = 'pop';



function show(options) {
	curType = 'pop';
	selected = options.selected;

	getList(function(list) {
		// listData = list;
		// _openList();
	});
}

function initPage(options) {
	curType = 'page';
	$pageContent = $(options.container);

	_rendPage();
}

function _rendPage() {
	getList(function(list) {

		$pageContent.html(listTmpl({
			list: listData,
			maxHei: 'auto'
		}));
		_initNodes();

	}, false);
}

/**
 * 获取地址列表
 * @param  {[type]} back [description]
 * @return {[type]}      [description]
 */
function getList(back, isOpenList) {

	// if (!listData) {
	new Ajax().send({
		url: $('#J-ajaxurl-address-list').val(),
		type: 'get'
	}, function(result) {
		listData = result.data || [];
		// selected && selected(_getDefault());

		if (isOpenList === undefined || isOpenList) {
			if (listData.length == 0) {
				_openDetail();
			} else {
				_openList();
			}
		}
		back && back(result.data);
	}, function(res) {});
	// } else {
	// 	back(listData);
	// }

}

function setDefault(evt) {
	var $radio = $(evt.currentTarget);
	var id = $radio.parents('li').attr('addr-id');

	// if ($radio.hasClass('selected')) {
	// 	return;
	// }
	new Ajax().send({
		url: $('#J-ajaxurl-address-setDefault').val(),
		data: {
			id: id
		}
	}, function() {
		$radios.removeClass('selected');
		$radio.addClass('selected');
	});
}

function edit(evt) {
	var $edit = $(evt.currentTarget);
	var addrId = $edit.parents('li').attr('addr-id');

	if (curType == 'pop') {
		Pop.hide(function() {
			doIt();
		});
	} else {
		doIt();
	}

	function doIt() {
		curItem = _getAddr(addrId);
		_openDetail();
	}
}

function add() {
	if (curType == 'pop') {
		Pop.hide(function() {
			doIt();
		});
	} else {
		doIt();
	}

	function doIt() {
		curItem = {};
		_openDetail();
	}
}

/**
 * 保存地址
 */
function save() {
	var name = $editContainer.find('.J-name').val();
	var phone = $editContainer.find('.J-phone').val();
	var pro = curAddr.addr.proId;
	var city = curAddr.addr.cityId;
	var region = curAddr.addr.regionId;
	var addr = $editContainer.find('.J-addr').val();

	if (!name) {
		Bubble.show('请输入用户名');
		return false;
	} else if (name.length > 20) {
		Bubble.show('用户名长度不得超过20位');
		return false;
	} else if (!phone || !/^1[3-8]\d{9}$/.test(phone)) {
		Bubble.show('请输入正确手机号码');
		return false;
	} else if (!pro) {
		Bubble.show('请选择你所在省份');
		return false;
	} else if (!city) {
		Bubble.show('请选择你所在市区');
		return false;
	} else if (!region) {
		Bubble.show('请选择你所在县区');
		return false;
	} else if (!addr) {
		Bubble.show('请输入你的详细地址');
		return false;
	} else if (addr.length > 100) {
		Bubble.show('详细地址长度不得超过100位')
		return false;
	}

	new Ajax().send({
		url: $('#J-ajaxurl-address-save').val(),
		type: 'post',
		data: {
			id: curItem.id,
			name: name,
			phone: phone,
			provinceId: pro,
			cityId: city,
			districtId: region,
			detailAddr: addr
		}
	}, function() {

		Pop.hide(function() {
			if (curType == 'pop') {
				getList(null, false);
			} else {
				_rendPage();
			}
		});
	});

	return false;
}

/**
 * 删除地址
 */
function del() {
	Confirm.show({
		msg: '您确定删除该地址吗？',
		yesBack: function() {
			new Ajax().send({
				url: $('#J-ajaxurl-address-del').val(),
				data: {
					id: curItem.id
				}
			}, function() {
				curItem = {};
				Pop.hide(function() {
					if (curType == 'pop') {
						getList();
					} else {
						_rendPage();
					}
				});
			});
		}
	});
}

function _getAddr(id) {
	var i = 0,
		item;

	for (; i < listData.length; i++) {
		item = listData[i];
		if (item.id == id) {
			return {
				id: item['id'],
				province_name: item['provinceName'],
				city_name: item['cityName'],
				region_name: item['districtName'],
				province_id: item['provinceId'],
				city_id: item['cityId'],
				district_id: item['districId'],
				recipient_address: item['detailAddr'],
				is_default: item['isDefault'],
				phone: item['rePhone'],
				realName: item['reName'],
				recipient_name: item['reName'],
				recipient_phone: item['rePhone'],
			};
		}
	}
	return {};
}

function _getDefault() {
	var i = 0,
		item;

	for (; i < listData.length; i++) {
		item = listData[i];
		if (item['isDefault'] == 1) {
			return item;
		}
	}
	return null;
}

/**
 * 打开list页
 */
function _openList() {
	Pop.show({
		title: '选择收货地址',
		content: listTmpl({
			list: listData,
			maxHei: $(window).height() * 0.7
		})
	});

	_initNodes();
}

function _initNodes() {
	$container = $('.address-container');
	$radios = $container.find('.radio');
	$addBtn = $container.find('.btn-add');

	$container.on('click', '.radio', setDefault);
	$container.on('click', '.addr-info', selCurrent);
	$container.on('click', '.edit', edit);
	$addBtn.on('click', add);
}

//选中当前
function selCurrent() {
	var id = $(this).parent().attr('addr-id');
	if (curType == 'pop') {
		Pop.hide();
	}
	selected && selected(_getAddr(id));
}

/**
 * 打开detail页
 */
function _openDetail() {
	Pop.show({
		title: '收货地址',
		content: editTmpl({
			item: curItem
		})
	});

	$editContainer = $('.address-edit');
	$saveBtn = $editContainer.find('.J-save');
	$delBtn = $editContainer.find('.J-del');

	$saveBtn.on('click', save);
	$delBtn.on('click', del);

	if (!curItem.province_name) {
		// try {
		// 	getPos(function(lat, lng) {
		// 		if (lat && lng) {
		// 			new Ajax().send({
		// 				url: '/User/Center/getConsigneeInfo',
		// 				data: {
		// 					lat: lat,
		// 					lng: lng
		// 				}
		// 			}, function(result) {
		// 				var bdAddrs = result.addressComponent;
		// 				var ids = result.regionId;

		// 				if (bdAddrs && ids.provinceId && ids.cityId && ids.districtId) {
		// 					curItem = {
		// 						province_name: bdAddrs.province,
		// 						city_name: bdAddrs.city,
		// 						region_name: bdAddrs.district,
		// 						province_id: ids.provinceId,
		// 						city_id: ids.cityId,
		// 						district_id: ids.districtId,
		// 						street: bdAddrs.street,
		// 						streetNum: bdAddrs.street_number,
		// 						phone: result.cellPhone,
		// 						realName: result.realName
		// 					}
		// 				}
		// 				_initAddrSel();
		// 			}, function() {
		// 				_initAddrSel();
		// 			});
		// 		} else {
		// 			_initAddrSel();
		// 		}

		// 	});
		// } catch (e) {
		_initAddrSel();
		// }
	} else {
		_initAddrSel();
	}
}

function _initAddrSel() {
	var $pro = $('#J-pro-text');
	var $city = $('#J-city-text');
	var $region = $('#J-region-text');
	var $addrV = $('.J-addr');
	var $phone = $('.address-edit').find('.J-phone');
	var $name = $('.address-edit').find('.J-name');

	try {
		if (curItem.province_name && $pro.text() == '选择省份') {
			$pro.text(curItem.province_name);
		}
		if (curItem.city_name && $city.text() == '选择市区') {
			$city.text(curItem.city_name);
		}
		if (curItem.region_name && $region.text() == '选择县区') {
			$region.text(curItem.region_name);
		}
		// if (curItem.street && !$addrV.val()) {
		// 	$addrV.val(curItem.street + curItem.streetNum);
		// }
		if (curItem.phone && !$phone.val()) { //电话
			$phone.val(curItem.phone);
		}
		if (curItem.realName && !$name.val()) { //用户名
			$name.val(curItem.realName);
		}
	} catch (e) {}

	curAddr = new AddrSel({
		proBtn: '#J-pro-text',
		cityBtn: '#J-city-text',
		regionBtn: '#J-region-text',
		addr: {
			pro: curItem.province_name,
			proId: curItem.province_id,
			city: curItem.city_name,
			cityId: curItem.city_id,
			region: curItem.region_name,
			regionId: curItem.district_id
		}
	});
}

/**
 * 获取当地地址
 */
function getPos(back) {
	if (window.navigator.geolocation) {
		var options = {
			enableHighAccuracy: true,
			maximumAge: 60000,
			timeout: 3000
		};
		try {

			window.navigator.geolocation.getCurrentPosition(function(position) {
				if (position && position.coords) {
					back(position.coords.latitude, position.coords.longitude);
				} else {
					back();
				}
				// handlePosSuc(position, back);
			}, function(error) {
				back();
				// handlePosError(error);
			}, options);
		} catch (e) {
			back();
		}

	} else {
		back();
		// alert('浏览器不支持');
	}
}

/**
 * 获取经纬度成功
 */
function handlePosSuc(position, back) {
	var lat = position.coords.latitude;
	var lng = position.coords.longitude;

	$.ajax({
		dataType: 'jsonp',
		url: 'http://api.map.baidu.com/geocoder/v2/',
		data: {
			ak: 'StUTq8hxAbyFSGKU2kUiEGFL',
			location: lat + ',' + lng,
			output: 'json',
			pois: 1
		},
		success: function(result) {
			if (result.status == 0) {
				back(result['result']['addressComponent']);
			} else {
				back();
			}
		}
	});
}

function handlePosError(error) {
	switch (error.code) {
		case error.PERMISSION_DENIED:
			// Bubble.show('无法获取当前位置');
			break;
		case error.POSITION_UNAVAILABLE:
			// Bubble.show('无法获取您的当前位置');
			break;
		case error.TIMEOUT:
			// Bubble.show('获取位置超时');
			break;
		case error.UNKNOWN_ERROR:
			// Bubble.show('未获取到您的当前位置');
			break;
	}
}


module.exports = {
	show: show,
	initPage: initPage
};