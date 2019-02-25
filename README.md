# express 

> 手动实现一个 express 框架，基于 TDD 模式开发，用于加深理解。复习时根据 git log 递进式阅读。

## 项目目录

```
├── LICENSE
├── README.md
├── lib                     框架源码
│   └── express.js          主入口
├── package-lock.json
├── package.json
└── test                    测试用例
    └── 1.base.js
```

## 一、构建基本服务器

### 1.1 基本功能

1. express 模块导出一个函数，执行后返回一个 app 对象
2. app.get 方法用于添加一条路由规则到内部缓存
3. app.listen 方法用于启动一个 HTTP 服务器并指定处理函数

### 1.2 测试用例

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.end('hello express');
});

app.listen(8080);
```

### 1.3 代码实现思路

1. 创建 `createApplication` 方法并导出，该方法返回 app 对象，有两个方法 get 和 listen
2. `app.get` 方法缓存路由规则，设定一个缓存队列 router 数组，并默认存入一条通用匹配规则
3. `app.listen` 方法创建服务器，用于遍历路由规则并执行对应回调，监听服务时将 listen 实参直接传给 http.Server 实例的 listen 方法

## 二、封装 Router

### 2.1 基本功能

> 为了避免定义 Restful 风格 API 接口时，同路径名不同请求方法，需要创建多个规则并逐一匹配的资源浪费问题，用法上表现为 app.get 方法支持`多个 handler 处理函数`来处理不同 method 的同名请求，底层上表现为路径相同的路由存储到同一 `Layer` 中（直观感觉为`二维数组`）

1. app 从字面量变为 Application 类
2. 丰富 HTTP 请求方法
3. 封装 Router
    - 路径一样的路由整合为一组，引入 Layer 的概念
    - 增加路由控制，支持 next 方法，并增加错误捕获功能
    - 执行 Router.handle 的时候传入 out 参数

### 2.2 测试用例

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res, next) => {
    console.log(1.1);
    // next(); 
    next('wrong'); 
}, (req, res, next) => {
    console.log(1.2);
    next();
}).get('/', (req, res, next) => {
    console.log(2.1);
    next();
}).get('/', (req, res, next) => {
    console.log(3.1);
    res.end('ok');
}).get('/', (err, req, res, next) => {
    res.end('catch: ' + err);
});
app.listen(8080);
```

### 2.3 代码实现思路

路由层级描述：
```
├── Router 路由系统
│   └── stack 数组
│       └── layer 层 <- path + route.dispath 
│           └── route 路由 <- path
│               └── stack 数组
│                   └──  layer 层 <- path '/' + handler
```

1. 将 app 从字面量变为 Application 类
    - createApplicaton 方法执行返回一个 Application 的实例
    - 将 get 和 listen 方法改为 Application 类的原型方法
    - 此时将 router 和应用分离开，也采用构建实例的方式，且 app.get 和 app.listen 配置路由和处理路由都将由 Router 类的实例去处理
2. 封装 Router（按照上面的层级描述）
    - 配置路由的第一层应该是 layer ，它拥有特殊属性 route 才是真正的路由
    - 配置路由的第二层才是 route ，它的特殊属性 method 标明是否有对应 hanlder 