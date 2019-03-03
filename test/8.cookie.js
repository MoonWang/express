// let express = require('express');
let express = require('../lib/express');
let cookieParser = require('cookie-parser');

let app = express();

app.use(cookieParser('!@#%^dfadf'));

app.get('/write', (req, res, next) => {
    res.cookie('name', 'moon', { signed: true });
    res.cookie('age', '18');
    res.end('write end');
});

app.get('/read', (req, res, next) => {
    console.dir(res);
    console.log(req.cookies);
    console.log(req.signedCookies);
    res.end('read ok');
});

app.listen(8080);