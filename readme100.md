#调度地址
 * http://devsocial.taojinzi.cn
 * http://wx.dazemall.com

##类库
 * [zepto](http://www.zeptojs.cn/) 基础类库
 * [fastclick](https://github.com/ftlabs/fastclick) 点击事件优化及防止穿透


##构建工具
>使用fis2及模块化解决方案fis-pure进行构建

 * [fis2](http://fex.baidu.com/fis-site/index.html)
 * [fis-prue](https://github.com/fex-team/fis-pure)


##目录结构
 * `images/` 图片资源
 * `lib/` 引用类库
 * `modules/` 模块化支持
 * `p/` 非模块化代码
 * `modules/common/` 公用模块
 * `page/` 各个页面
 * `fis-config.js` fis配置文件


##日常开发
 1. 打开cmd或PowerShell，进入项目目录
 2. `pure server start` 启动pure
 3. `pure release -pw` 实时监控修改，打包并发布
 4. 写代码并在浏览器中查看效果


##日常联调
 1. 打开cmd或PowerShell，进入项目目录
 2. `pure release -pd php静态资源目录` 发布至php dev分支上的静态资源目录
 	* dev静态资源目录 `svn://121.40.50.201/wemall_front/branches/dev`
 	* test静态资源目录 `svn://121.40.50.201/wemall_front/trunk`
 3. 生成css_map.php和js_map.php
 4. svn提交php
 5. 在[dev联调地址](http://duobao.taojinzi.cn/)查看效果


##发布
 1. 打开cmd或PowerShell，进入项目目录
 2. `pure release -pmod 发布目录` 把打包、压缩、带md5码的文件发布至发布目录
 3. 把发布目录文件上传至cdn
 	* cdn主机号 `121.40.215.41`
 	* cdn端口号 `53215`
 	* cdn用户名 `wangling`
 	* cdn密码 `ey6W7Q64tnWPGSwmZPiod0RIVtnrObwOOUYxb8OkJRy`
 4. 生成css_map.php和js_map.php至php trunk分支 	
 5. 等待php文件上线，检测上线结果