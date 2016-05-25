var $ = require('zepto');
var Ajax = require('common/ajax/index');
var Alert = require('common/alert/alert');

var _tmpl = __inline('selector.tmpl');
var $selector;
var selType;

function AddrSel(options) {
	this.options = options;
	this.addr = options.addr || {
		pro: '',
		proId: 0,
		city: '',
		cityId: 0,
		region: '',
		regionId: 0
	};

	this._init();
}

AddrSel.prototype = {
	_init: function() {
		var self = this;

		self.$proBtn = $(self.options.proBtn);
		self.$cityBtn = $(self.options.cityBtn);
		self.$regionBtn = $(self.options.regionBtn);

		self.$proBtn.on('change', function(e) {
			self._proChange(e);
		});

		self.$cityBtn.on('change', function(e) {
			self._cityChange(e);
		});

		self.$regionBtn.on('change', function(e) {
			self._regionChange(e);
		});

		self._getPro();

		if (this.addr.cityId) {
			self._getCity();
		}

		if (this.addr.regionId) {
			self._getRegion();
		}

		self._onSelect();
	},

	_proChange: function(e) {
		var self = this;
		var select = e.currentTarget;
		var option = select.options[select.selectedIndex];

		self.addr.pro = option.text;
		self.addr.proId = option.value;

		self._getCity(function() {
			self.$regionBtn[0].selectedIndex = 0;
		});
	},

	_cityChange: function(e) {
		var select = e.currentTarget;
		var option = select.options[select.selectedIndex];

		this.addr.city = option.text;
		this.addr.cityId = option.value;

		this._getRegion();
	},


	_regionChange: function(e) {
		// var option = e.currentTarget.selectedOptions[0];
		var select = e.currentTarget;
		var option = select.options[select.selectedIndex];

		this.addr.region = option.text;
		this.addr.regionId = option.value;
	},

	_getPro: function() {
		var self = this;
		new Ajax().send({
			url: '/api/UserAddress/getAllProvince'
		}, function(result) {
			var list = result.data;


			selType = 'pro';
			list.unshift({
				region_id: '-1',
				region_name: '选择省份'
			});


			self.$proBtn.html($(_tmpl({
				list: list,
				id: self.addr[selType + 'Id']
			})));
		});
	},

	_getCity: function(back) {
		var self = this;

		new Ajax().send({
			url: '/api/UserAddress/getAllCity',
			data: {
				province_id: self.addr.proId
			}
		}, function(result) {
			var list = result.data;

			selType = 'city';
			list.unshift({
				region_id: '-1',
				region_name: '选择市区'
			});

			self.$cityBtn.html($(_tmpl({
				list: list,
				id: self.addr[selType + 'Id']
			})));

			back && back();
		});
	},


	_getRegion: function() {
		var self = this;

		new Ajax().send({
			url: '/api/UserAddress/getAllDistrict',
			data: {
				province_id: self.addr.proId,
				city_id: self.addr.cityId
			}
		}, function(result) {
			var list = result.data;

			selType = 'region';
			list.unshift({
				region_id: '-1',
				region_name: '选择县区'
			});
			self.$regionBtn.html($(_tmpl({
				list: list,
				id: self.addr[selType + 'Id']
			})));

		});
	},


	_onSelect: function() {
		var self = this;

		$(document.body).off('click', '.addr-selector li');
		$(document.body).on('click', '.addr-selector li', function() {
			var $cur = $(this);
			var id, text;

			Alert.hide();

			id = $cur.attr('addrId');
			text = $cur.text();

			self._setText(selType, text, id);

			switch (selType) {
				case 'pro':
					self._setText('city', '请选择市区', -1);
					self._setText('region', '请选择县区', -1);
					break;
				case 'city':
					self._setText('region', '请选择县区', -1);
					break;
			}

			return false;
		});
	},

	_setText: function(selType, text, id) {
		var self = this;

		self.addr[selType] = text;
		self.addr[selType + 'Id'] = id;
		self['$' + selType + 'Btn'].text(text);
	},

	_selPro: function() {
		var self = this;

		new Ajax().send({
			url: '/User/Center/getAllProvince'
		}, function(result) {
			var list = result.data;

			selType = 'pro';
			list.unshift({
				region_id: '-1',
				region_name: '选择省份'
			});
			Alert.show(_tmpl({
				list: list,
				id: self.addr[selType + 'Id']
			}));

		});
	},

	_selCity: function() {
		var self = this;

		new Ajax().send({
			url: '/User/Center/getAllCity',
			data: {
				province_id: self.addr.proId
			}
		}, function(result) {
			var list = result.data;

			selType = 'city';
			list.unshift({
				region_id: '-1',
				region_name: '请选择市区'
			});
			Alert.show(_tmpl({
				list: list,
				id: self.addr[selType + 'Id']
			}));

		});
	},

	_selRegion: function() {
		var self = this;

		new Ajax().send({
			url: '/User/Center/getAllDistrict',
			data: {
				city_id: self.addr.cityId
			}
		}, function(result) {
			var list = result.data;

			selType = 'region';
			list.unshift({
				region_id: '-1',
				region_name: '请选择县区'
			});
			Alert.show(_tmpl({
				list: list,
				id: self.addr[selType + 'Id']
			}));

		});
	}
};


module.exports = AddrSel;