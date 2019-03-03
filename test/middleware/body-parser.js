let zlib = require('zlib');
let querystring = require('querystring');
let qs = require('qs');
let { parse } = require('content-type');
let iconv = require('iconv-lite');

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
    // extended：true 使用 qs，false 使用 querystring ，参数嵌套的区别
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
        contentType = parse(contentType); // { type: "text/plain", parameters:Object {charset: "gbk"} }
        let type = contentType.type;
        let charset = contentType.parameters.charset || 'utf8';
        if (type == 'text/plain') {
            let buffers = [];
            req.on('data', function (data) {
                buffers.push(data);
            });
            req.on('end', function () {
                let zlibType = req.headers['content-encoding'];
                let result = Buffer.concat(buffers);
                // 只做了一种处理，且是同步的，正常应该做兼容处理，且异步的
                if(zlibType == 'gzip') {
                    result = zlib.gunzipSync(result);
                }
                req.body = Buffer.isEncoding(charset) ? 
                    result.toString(charset) : 
                    iconv.decode(result, charset);
                next();
            });
        } else {
            next();
        }
    };
};

module.exports = bodyParser;