const url = require('url');
const http = require('http');
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
            let { 
                signed = false,
                domain, 
                path = '/', 
                maxAge, 
                expires, 
                httpOnly = false, 
                secure = false
            } = options;
            
            if(signed) {
                // 获取 cookie-parser 的签名内容
                value = 's:' + sign(value, req.secret);
            }

            let parts = [`${name}=${value}`];
            if (domain) {
                parts.push(`Domain=${domain}`);
            }
            if (path) {
                parts.push(`Path=${path}`);
            }
            if (maxAge) {
                parts.push(`Max-Age=${maxAge}`);
            }
            if (expires) {
                parts.push(`Expires=${expires.toUTCString()}`);
            }
            if (httpOnly) {
                parts.push(`httpOnly`);
            }
            if (secure) {
                parts.push(`Secure`);
            }
            let cookie = parts.join('; ');

            // 判断是否多次设置
            let last = res.getHeader('Set-Cookie');
            if(last) {
                last.push(cookie);
            } else {
                last = [cookie];
            }
            // 只有最后一次设置生效，需要设置多次 cookie ，需要将其传入数组处理
            res.setHeader('Set-Cookie', last);
        };

        // 302 临时重定向
        res.redirect = function redirect(url) {
            res.writeHead(302, { 'Location': url });
            res.end(http.STATUS_CODES[302]);;
        };
    
        next();
    }
};