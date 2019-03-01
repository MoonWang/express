const url = require('url');
module.exports = function (req, res, next) {
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
    let self = this;
    // res 模板渲染方法
    res.render = function(filepath, options, callback) {
        function done(err, html) {
            res.setHeader('Content-Type', 'text/html');
            res.end(html);
        }
        self.render(filepath, options, callback || done);
    }

    next();
};