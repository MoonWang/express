const http = require('http');
//实现 Router 和应用的分离
const Router = require('./router');

function Application() {
    this._router = new Router();
}

Application.prototype.get = function(path, handler) {
    this._router.get(path, handler);
};

Application.prototype.listen = function () {
    let self = this;
    let server = http.createServer(function (req, res) {
        function done() {
            res.end(`Cannot ${req.method} ${req.url}`);
        }
        // 请求无法被路由系统匹配处理时，将其交给 done 方法处理
        self._router.handler(req, res, done);
    });
    // 使用 apply 为了保持参数的灵活性，直接原封不动传入所有参数
    server.listen.apply(server, arguments);
}

module.exports = Application;