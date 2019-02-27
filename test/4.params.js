// const express = require('express');
const express = require('../lib/express');
const app = express();

app.param('uid', (req, res, next, val, name) => {
    req.user = {
        id: 1,
        name: 'moon'
    };
    next();
})
app.param('uid', (req, res, next, val, name) => {
    req.user.name = 'moon.wang';
    next();
})
app.get('/user/:uid/:name', (req, res) => {
    console.log(req.user);  // 前面配置的
    console.log(req.params); // 路径参数
    res.end('user');
});

app.listen(8080);