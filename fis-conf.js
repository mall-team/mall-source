// fis.config.set('roadmap.domain', {
// 	'image' : ['http://cdn0.taojinzi.com','http://cdn1.taojinzi.com','http://cdn2.taojinzi.com']
// });
fis.config.set('statics', 'static');

fis.config.get('roadmap.path').unshift({
	reg: /^\/page\/(.*)$/i,
	useCache: false,
	release: 'template/$1'
});

// fis.config.get('roadmap.path').unshift(
// 	{
// 		//一级同名组件，可以引用短路径，比如modules/jquery/juqery.js
// 		//直接引用为var $ = require('jquery');
// 		reg: /^\/modules\/([^\/]+)\/\1\.(js)$/i,
// 		//是组件化的，会被jswrapper包装
// 		isMod: true,
// 		//id为文件夹名
// 		id: '$1',
// 		query: '?t=${timestamp}',
// 		release: '${statics}/$&'
// 	}, {
// 		//modules目录下的其他脚本文件
// 		reg: /^\/modules\/(.*)\.(js)$/i,
// 		//是组件化的，会被jswrapper包装
// 		isMod: true,
// 		//id是去掉modules和.js后缀中间的部分
// 		id: '$1',
// 		query: '?t=${timestamp}',
// 		release: '${statics}/$&'
// 	}, {
// 		//less的mixin文件无需发布
// 		reg: /^(.*)mixin\.less$/i,
// 		release: false
// 	}, 
// 	{
// 		reg: /.*\.(js|css)$/,
// 		query: '?t=${timestamp}',
// 		//useSprite: true
// 		useHash: false
// 	}, {
// 		//其他css文件
// 		reg: /^(.*)\.(css|less)$/i,
// 		query: '?t=${timestamp}',
// 		release: '${statics}/$&'
// 	})


fis.config.set('pack', {
	'pkg/lib.js': [
		'/lib/mod.js',
		'/modules/zepto/**.js',
		'/modules/fastclick/**.js',
		'/modules/common/gold/index.js'
		// '/modules/underscore/**.js',
	]
});

//file : fis-conf.js
//开启autoCombine可以将零散资源进行自动打包
fis.config.set('settings.postpackager.simple.autoCombine', true);

//静态资源域名，使用pure release命令时，添加--domains或-D参数即可生效
//fis.config.set('roadmap.domain', 'http://127.0.0.1:8080');

//如果要兼容低版本ie显示透明png图片，请使用pngquant作为图片压缩器，
//否则png图片透明部分在ie下会显示灰色背景
//使用spmx release命令时，添加--optimize或-o参数即可生效
//fis.config.set('settings.optimzier.png-compressor.type', 'pngquant');

//设置jshint插件要排除检查的文件，默认不检查lib、jquery、backbone、underscore等文件
//使用pure release命令时，添加--lint或-l参数即可生效
fis.config.set('settings.lint.jshint.ignored', ['lib/**', /jquery|backbone|underscore/i]);

fis.config.set('modules.spriter', 'csssprites');
//csssprite处理时图片之间的边距，默认是3px
fis.config.set('settings.spriter.csssprites.margin', 5);