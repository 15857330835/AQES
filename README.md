# 开发说明
## 项目运行
```js
安装依赖：
yarn

运行：
yarn serve

打包：
yarn build
```

## 目录结构简介
### 本地开发目录结构
```
public
  js
    comment.js 本地的入口文件
    nces.js 本地的项目配置文件
  static
    css
      global.css 配置全局css
src
  api api目录
  components 小部分组件
  config 类型定义
  css 
  icons
  img 图片目录
  model 主要组件目录
  store vuex配置目录
  utils 工具目录
  app.vue
  http.js axios配置目录
  main.js vue入口
```
> vscode中可以使用sftp插件，.vscode/sftp.json的内容如下
```
 {
  "name": "云非编",
  "host": "121.40.199.27",
  "port": 21,
  "username": "czftp",
  "password": "Czftp123",
  "protocol": "ftp",
  "remotePath": "/usr/local/tengine/html/ncesliu/",
  "syncOption": {
      "delete": true
  },
  "uploadOnSave": false
 }
 ```
> 这样每次build好后就直接鼠标右键dist目录，再upload就可以了


### 线上fm目录结构
```
index.html 入口html
js
  comment.js
  nces.js
dist 其实就是vue打包出来的文件内容，部分文件是不需要的,不用理会
  css
  font
  img
  js
    app.js
    chunk-vendors.js
    comment.js 不需要
    nces.js 不需要
  static
  index.html 不需要
node_modules
```

### svn上非编目录结构
```
v1111 版本号，平时每上线一次要复制上一次的文件夹，进入v2/v3，删除dist文件夹，将vue打包出来的dist文件夹复制到原来的dist文件夹的位置，并且进入dist目录删除index.html，js/comment.js，js/nces.js
  v2 奥点内部账号使用的版本
    dist
    js
      comment.js 入口文件
    
  v3 奥点外部账号和广电使用的版本

```
在本地和fm中的nces.js和index.html在线上svn版本是没有的，因为其内容已经写到了外部的index.php中，所以要修改线上的nces.js和index.html中的代码要和奥点和广电的相关人士沟通

### 快捷键的绑定
通过设定window.zindex的值来切换

