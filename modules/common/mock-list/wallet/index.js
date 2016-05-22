var Mock = require('common/mockjs/index');

var data = Mock.mock(/User\/Center\/walletList/, {
	'code': 0,
	'result': {
		'data|10': [{
			'consum_type': '购买商品',
			'amount|10-1000.2': 100,
			'create_time': '2015-06-28 08:34:57'
		}]
	}
});