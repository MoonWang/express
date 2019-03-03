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
    }
};

module.exports = bodyParser;