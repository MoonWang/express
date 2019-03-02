let express = require('express');
let path = require('path');
// let static = express.static;
let static = require('./middleware/serve-static');

let app = express();

app.use(static(path.join(__dirname, 'public'), {
    // dotfiles: 'allow', // 'allow'、'deny'、'ignore'
    // index: false,
    // redirect: false,
    // extensions: ['html', 'htm'],
    // etag: false,
    // lastModified: false,
    // maxAge: 60 * 1000,
    // setHeaders(res, path, stat) {
    //     res.setHeader('time', Date.now());
    // }
}));

app.listen(8080);