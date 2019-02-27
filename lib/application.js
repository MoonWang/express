const http = require('http');
const methods = require('methods');
//实现 Router 和应用的分离
const Router = require('./router');

const slice = Array.prototype.slice;

function Application() {
    // this._router = new Router(); 
    // 优化：改成懒加载，在调用具体请求方法时，才判断加载
}

Application.prototype.lazyrouter = function() {
    if(!this._router) {
        this._router = new Router();
    }
};

// 遍历 methods 类型添加路由规则
methods.forEach(method => {
    Application.prototype[method] = function(path) {
        this.lazyrouter();
        // 支持多 handler 
        this._router[method].apply(this._router, slice.call(arguments));
        // 返回 route 实例，实现链式调用
        return this;
    };
});

// 启动服务器
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
    // 效果等同于 server.listen(...arguments);
    server.listen.apply(server, arguments);
};

// 添加中间件
Application.prototype.use = function() {
    this.lazyrouter();
    // 参数透传
    this._router.use.apply(this._router, arguments);
};

// 添加 param 方法
Application.prototype.param = function(name, handler) {
    this.lazyrouter();
    // 参数透传
    this._router.param.apply(this._router, arguments);
};

module.exports = Application;
