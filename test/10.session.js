// let express = require('express');
let express = require('../lib/express');
let path = require('path');
let session = require('express-session');

// let MongoStore = require('mongo-store')(session);
// let RedisStore = require('redis-store')(session);

let app = express();

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: '!@#%moon',
    // store: ,
    // name: 'sid',
    // rolling: true,
    // genid() {
    //     return uuid.v4();
    // },
    // cookie: {
    //     expires: new Date(Date.now() + 10000)
    // }
}));

app.get('/', (req, res) => {
    let count = req.session.count;
    count = count ? count + 1 : 1;
    req.session.count = count;

    res.end('welcome to ' + count);
});

app.listen(8080);
