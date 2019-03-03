let querystring = require('querystring');
let qs = require('qs');

const bodyParser = Object.create(null);

bodyParser.json = function() {
    return function(req, res, next) {
        let contentType = req.headers['content-type'];
        if (contentType == 'application/json') {
            let buffers = [];
            req.on('data', function (data) {
                buffers.push(data);
            });
            req.on('end', function () {
                let result = Buffer.concat(buffers).toString();
                req.body = JSON.parse(result);
                next();
            });
        } else {
            next();
        }
    };
};

bodyParser.urlencoded = function(options = {}) {
    // extended：true 使用 qs，false 使用 querystring 
    // 不推荐使用默认值
    let { extended = true } = options;

    return function(req, res, next) {
        let contentType = req.headers['content-type'];
        if (contentType == 'application/x-www-form-urlencoded') {
            let buffers = [];
            req.on('data', function (data) {
                buffers.push(data);
            });
            req.on('end', function () {
                let result = Buffer.concat(buffers).toString();
                req.body = extended ? 
                    qs.parse(result) : 
                    querystring.parse(result);
                next();
            });
        } else {
            next();
        }
    };
};

bodyParser.text = function() {
    return function(req, res, next) {
        let contentType = req.headers['content-type'];
        if (contentType == 'text/plain') {
            let buffers = [];
            req.on('data', function (data) {
                buffers.push(data);
            });
            req.on('end', function () {
                let result = Buffer.concat(buffers).toString();
                req.body = result;
                next();
            });
        } else {
            next();
        }
    };
};

module.exports = bodyParser;