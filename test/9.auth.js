let path = require('path');
let express = require('../lib/express');

let bodyParser = require('./middleware/body-parser');
let cookieParser = require('cookie-parser');

let app = express();

app.use(bodyParser.urlencoded());
app.use(cookieParser());

// 设置模板
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('../lib/html'));

app.get('/login', (req, res) => {
    res.render('login', {
        title: '登录'
    });
});

app.post('/login', (req, res) => {
    let { username, password } = req.body;
    // 伪判断
    if(username == '1' && password == '1') {
        // 防客户端篡改
        res.cookie('username', username, {
            httpOnly: true
        });
        res.redirect('/user');
    }
});

// 权限验证中间件，已登录则继续，未登录重定向到登录页
function checkLogin() {
    return function(req, res, next) {
        if(req.cookies.username) {
            next();
        } else {
            res.redirect('/login');
        }
    };
}

// 权限验证中间件，不是所有路由都需要，所以可以在需要的地方传入
app.get('/user', checkLogin(), (req, res) => {
    let { username } = req.cookies;
    res.render('user', {
        username
    });
});

// 不需要权限验证的页面
app.get('/help',(req, res) => {
    res.setHeader('Content-Type', 'text/html;charset=utf8');
    res.end('帮助页面');
});

app.listen(8080);