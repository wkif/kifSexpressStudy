---
title: Express学习笔记
author: kif
tags:
  - node.js
  - express
categories:
  - 学习笔记
date: 2022-11-08 18:46:00
cover: https://kifimg.oss-cn-beijing.aliyuncs.com/img/202211081857301.png
coverWidth: 1200
coverHeight: 750
---



# Express的安装

```
npm install express -g
```



# 脚手架工具

安装express的脚手架工具`express-generator`

```
npm install express-generator -g
```

 创建项目

```crystal
express express-demo
```

安装依赖

```crystal
cd express-demo && npm install
```

运行

```crystal
npm start
```

  在浏览器里面输入：http://localhost:3000/



# 路由

## 路由方法

Express方法源于 HTTP 方法之一，附加到 express 类的实例。它可请求的方法包括：

get、post、put、head、delete、options、trace、copy、lock、mkcol、move、purge、propfind、proppatch、unlock、report、mkactivity、checkout、merge、m-search、notify、subscribe、unsubscribe、patch、search 和 connect。

## 路径

Express路径包含三种表达形式，分别为字符串、字符串模式、正则表达式

#### 1.字符串路径

```js
app.get("/login",function(req,res){
	res.send("kif");
})
```

此路径地址将与/login匹配

#### 2.字符串模式路径

```js
app.get("/ab+cd",function(req,res){
	res.send("kif");
})
```

此路径地址将与acd和abcd匹配

#### 3.正则表达式路径

```js
app.get(/^a/,function(req,res){
	res.send("kif");
})
```

匹配开头必须是a的路径

eg:

```js
const express = require("express");
var app = express();

app.get("/",function(req,res){
	res.send(`<h1>主页</h1>`);
});
app.get("/login",function(req,res){
	res.send(“登录页面”);
});
app.get("/registe",function(req,res){
	res.send(“注册页面”);
});

app.listen(8080);

```



## 动态路由

动态路由使得我们不必向之前那样每一个路由路径都必须亲自设定，大大提高了开发上的效率，通过下面代码，在自定义路由之后，可通过req.params来获取路由信息：

```js
const express = require("express");
var app = express();

app.get("/",function(req,res){
	res.send(`<h1>oh no</h1>`);
});
app.get("/login/:aid",function(req,res){
	res.send(req.params);
});

app.listen(8080);
```

# get

获取get参数:

```js
app.get("/login",function(req,res){
	console.log(req.query);
	res.send("登录路由，user为："+req.query.user+"==>   password为："+req.query.password);
});
```

# post

使用npm提供的body-parser或者connect-multiparty来获取post数据

### body-parser

Express中默认都使用body-parser作为请求体解析post数据，这个模块也能解析：JSON、Raw、文本、URL-encoded格式的请求体。
首先在项目目录安装body-parser：

```
npm install body-parser --save
```

在项目app.js中,引用和设置该模块：

```js
const bodyParser=require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
// 全局 中间件  解决所有路由的 跨域问题
app.all('*',function (req,res,next) {
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Headers','X-Requested-With,Content-Type')
    res.header('Access-Control-Allow-Methods','GET,POST,OPTIONS')
    next()
})
```

bodyParser.json()很明显是将json作为消息主体，再且常见的语言和浏览器大都支持json规范，使得json处理起来不会遇上兼容性问题。
application/x-www-form-urlencoded：
如果form表单不设置enctype属性，那么他默认就会是这种。
之后获取数据：

```js
app.post("/",urlencodedParser,function(req,res){
    // req: 客户端 携带的信息
  // console.log(req.query)
  // console.log(req.params)
  console.log(req.body)
  // console.log(req.get('Origin'))
  // console.log(req.url)
	res.send(req.body);
});
```

在中间添加urlencodedParser，请求是依然使用req.body获取数据。



#### connect-multiparty

```
npm install connect-multiparty --save
```

# 中间件

中间件也分为应用层中间件、路由中间件、内置中间件、错误处理中间件和第三方中间件。

### 应用层中间件

应用层中间件绑定到app对象使用app.use和app.METHOD()-需要处理http请求的方法，例如GET、PUT、POST，将之前的get或者post替换为use就行。
例如下面实例：

```js
const express=require("express");

var app=express();

//匹配路由之前的操作
app.use(function(req,res){
	console.log("访问之前");
});

app.get("/",function(req,res){
	res.send("主页");
});

app.listen(8080);
```

这时我们会发现http://localhost:8080/地址一直在加载，但命令行里显示了“访问之前”，说明程序并不会同步执行，如果使用next来是路由继续向下匹配，那么就能又得到主页数据了：

```js
const express=require("express");

var app=express();

//匹配路由之前的操作
app.use(function(req,res,next){
	console.log("访问之前");
	next();
});

app.get("/",function(req,res){
	res.send("主页");
});

app.listen(8080);

```

当然也可以简化写法：

```js
const express=require("express");

var app=express();

app.use(function(req,res,next){
	console.log("访问之前");
	next();
},function(req,res){
	res.send("主页");
});

app.listen(8080);
```

因此，在进行路由匹配之前又要继续向下执行时想做个操作，那么应用层中间件无疑是好的选择。

### 路由中间件

路由级中间件和应用级中间件类似，只不过他需要绑定express.Router();

```
var router = express.Router()
```

在匹配路由时，我们使用 router.use() 或 router.VERB() ,路由中间件结合多次callback可用于用户登录及用户状态检测。

```js
router.post('/postTest', (req, res, next) => {
  console.log('访问前')
  next()
}, function (req, res, next) {
  // req: 客户端 携带的信息
  // console.log(req.query)
  // console.log(req.params)
  console.log(req.body)
  // console.log(req.get('Origin'))
  // console.log(req.url)
  res.render('index', { title: 'Express' });
});
```

总之在检测用户登录和引导用户应该访问哪个页面是，路由中间件绝对好用。

### 错误处理中间件

顾名思义，它是指当我们匹配不到路由时所执行的操作。错误处理中间件和其他中间件基本一样，只不过其需要开发者提供4个自变量参数。

```js
app.use((err, req, res, next) => {
        res.sendStatus(err.httpStatusCode).json(err);
});
```

一般情况下，我们把错误处理放在最下面，这样我们即可对错误进行集中处理。

```js
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  logger.error(err.message)
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
```

### 内置中间件

从版本4.x开始，Express不再依赖Content，也就是说Express以前的内置中间件作为单独模块，express.[static](https://so.csdn.net/so/search?q=static&spm=1001.2101.3001.7020)是Express的唯一内置中间件。

```
express.static(root, [options]);
1
```

通过express.static我们可以指定要加载的静态资源。root代表加载静态资源的路径，options作为可选参数拥有一下属性：

| 属性         | 描述                                                         | 类型   | 缺省值       |
| ------------ | ------------------------------------------------------------ | ------ | ------------ |
| dotfiles     | 是否对外输出文件名以点（.）开头的文件。有效值包括“allow”、“deny”和“ignore” | 字符串 | “ignore”     |
| etag         | 启用或禁用 etag 生成                                         | 布尔   | true         |
| extensions   | 用于设置后备文件扩展名。                                     | 数组   | []           |
| index        | 发送目录索引文件。设置为 false 可禁用建立目录索引。          | 混合   | “index.html” |
| lastModified | 将 Last-Modified 的头设置为操作系统上该文件的上次修改日期。有效值包括 true 或 false。 | 布尔   | true         |
| maxAge       | 设置 Cache-Control 头的 max-age 属性（以毫秒或者 ms 格式中的字符串为单位） | 数字   | 0            |
| redirect     | 当路径名是目录时重定向到结尾的“/”。                          | 布尔   |              |
| setHeaders   | 用于设置随文件一起提供的 HTTP 头的函数。                     | 函数   | true         |

以下示例将使用了 express.static 中间件，并且提供了一个详细的’options’对象（作为示例）：

```
var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html'],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now());
  }
}

app.use(express.static('public', options));
```