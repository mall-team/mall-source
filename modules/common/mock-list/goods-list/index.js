var Mock = require('common/mockjs/index');

var data = Mock.mock(/goodslistAction\/get_list_data/, {
	'code': 0,
	'result': {
		'goodslist|10': [{
			'image_url': '/static/images/test/tuan-1.png',
			'product_name|1-3': '玉兰油',
			'retail_price|100-200.2': 100,
			'market_price|300-500.2': 100
		}]
	}
});