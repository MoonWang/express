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