const http = require('http');
const path = require('path');
const methods = require('methods');
//实现 Router 和应用的分离
const Router = require('./router');

const init = require('./middleware/init');

const slice = Array.prototype.slice;

function Application() {
    // this._router = new Router(); 
    // 优化：改成懒加载，在调用具体请求方法时，才判断加载

    this.settings = {}; // 用来保存参数，set 写 get 读
    this.engines = {};  // 用来保存根据文件扩展名存储的渲染函数
}

Application.prototype.lazyrouter = function() {
    if(!this._router) {
        this._router = new Router();

        // 直接调用内部中间件
        this._router.use(init.bind(this));
    }
};

// 遍历 methods 类型添加路由规则
methods.forEach(method => {
    Application.prototype[method] = function(path) {
        // 特殊处理，get 单参数为请求获取配置
        if (method == 'get' && arguments.length == 1) {
            return this.set(arguments[0]);
        }
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

// 传二个参数表示设置，传一个参数表示获取
Application.prototype.set = function (key, val) {
    if (arguments.length == 1) {
        return this.settings[key];
    }
    this.settings[key] = val;
}
// 规定何种后缀的文件用什么方法来渲染
Application.prototype.engine = function (ext, render) {
    let extension = ext[0] == '.' ? ext : '.' + ext;
    this.engines[extension] = render;
}
// 模板渲染方法
Application.prototype.render = function(name, options, callback) {
    let ext = '.' + this.get('view engine');
    name = name.indexOf('.') != -1 ? name : name + ext;
    let filepath = path.join(this.get('views'), name);
    let render = this.engines[ext];
    render(filepath, options, callback);
};

module.exports = Application;
