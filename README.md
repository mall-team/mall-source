# mall-source
### 安装构建工具
1. 安装nodejs，要用V0.12.8版本的
2. 安装[fis](http://fex.baidu.com/fis-site/index.html)，`npm install -g fis`
3. 安装[pure](https://github.com/fex-team/fis-pure)， `npm install -g fis-pure`

### 使用构建工具
1. `pure server start` 启动fis本地服务器
2. `pure release -pw` 构建并发布前端代码到本地服务器
3. `pure server open` 打开本地服务器根目录
3. `pure release -pd ../mall-dest` 构建前端代码到指定位置，本例构建代码到`../mall-dest`
