// const express = require('express');
const express = require('../lib/express');
const app = express();

app.use((req, res, next) => {
    console.log('Ware1:', Date.now());
    next();
    // next('wrong');
});
app.get('/', (req, res, next) => {
    res.end('1');
});

// 声明二级路由系统，也拥有各种请求方法，而且还有 use 方法添加私有中间件
const user = express.Router();
user.use((req, res, next) => {
    console.log('Ware2:', Date.now());
    next();
});
user.use('/2', (req, res, next) => {
    res.end('2');
});
// 使用二级路由
app.use('/user', user);

// 错误中间件
app.use((err, req, res, next) => {
    res.end('catch ' + err);
});
app.listen(8080);