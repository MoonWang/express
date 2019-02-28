// const express = require('express');
const express = require('../lib/express');

const path = require('path');
const app = express();

// 设置模板引擎，遇到 html 结尾的模板，使用参数2方法来进行渲染， render(filepath, options, callback)
// app.engine('html', require('ejs').__express);
app.engine('html', require('../lib/html'));
// 设置模板存放根目录
app.set('views', path.resolve(__dirname, 'views'));
// 设置默认后缀名，当 render 没有指定模板后台名时，使用 html 作为后缀名
app.set('view engine', 'html');

app.use((req, res, next) => {
    res.render = function(name, options) {
        let ext = '.' + app.get('view engine');
        name = name.indexOf('.') != -1 ? name : name + ext;
        let filepath = path.join(app.get('views'), name);
        let render = app.engines[ext];
        function done(err, html) {
            res.setHeader('Content-Type', 'text/html');
            res.end(html);
        }
        render(filepath, options, done);
    };
    next();
});

app.get('/', (req, res, next) => {
    res.render('index', {
        title: 'hello',
        user: {
            name: 'moon'
        }
    });
});

app.listen(8080);