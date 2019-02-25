// const express = require('express');
const express = require('../lib/express');
const app = express();

// 一个路径可有两个函数参数，设计目的是为了路径分组
app.get('/', (req, res, next) => {
    console.log(1.1);
    next(); // 正常向下执行
    // next('wrong'); // 把错误交给 next 后会跳过后面所有的正常处理函数，交给错误处理中间件来进行处理
}, (req, res, next) => {
    console.log(1.2);
    next();
// }).get('/', (req, res, next) => {
//     console.log(2.1);
//     next();
// }).get('/', (req, res, next) => {
//     console.log(3.1);
//     res.end('ok');
// }).get('/', (err, req, res, next) => {
//     res.end('catch: ' + err);
});
app.listen(8080);