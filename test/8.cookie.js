// let express = require('express');
let express = require('../lib/express');
let cookieParser = require('cookie-parser');

let app = express();

app.use(cookieParser('!@#%^dfadf'));

app.get('/write', (req, res, next) => {
    res.cookie('name', 'moon', { 
        domain: 'localhost',
        path: '/write',
        maxAge: 10 * 1000,
        expires: new Date(Date.now() + 60 * 1000),
        httpOnly: true,
        // secure: true,
        // signed: true 
    });
    res.cookie('age', '18');
    res.end('write end');
});

app.get('/read', (req, res, next) => {
    console.dir(res);
    console.log(req.cookies);
    console.log(req.signedCookies);
    res.json(req.cookies);
});

app.listen(8080);