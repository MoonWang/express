const url = require('url');
const { sign } = require('cookie-signature');

module.exports = function(app) {
    return function (req, res, next) {
        // req 添加 query 和 path
        let { pathname, query } = url.parse(req.url, true);
        req.path = pathname;
        req.query = query;
    
        // res 可以直接返回 json 字符串
        res.json = function (obj) {
            res.setHeader('Content-Type', 'application/json');
            const str = JSON.stringify(obj);
            res.end(str);
        };
        
        // res 模板渲染方法
        res.render = function(filepath, options, callback) {
            function done(err, html) {
                res.setHeader('Content-Type', 'text/html');
                res.end(html);
            }
            app.render(filepath, options, callback || done);
        };

        // 设置 cookie
        res.cookie = function(name, value, options = {}) {
            // 获取 cookie-parser 的签名内容
            let { signed = false } = options;
            if(signed) {
                value = 's:' + sign(value, req.secret);
            }

            let last = res.getHeader('Set-Cookie');
            if(last) {
                last.push(`${name}=${value}`);
            } else {
                last = [`${name}=${value}`];
            }
            res.setHeader('Set-Cookie', last);
        };
    
        next();
    }
};