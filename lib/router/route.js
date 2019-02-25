const methods = require('methods');

const Layer = require('./layer');

const slice = Array.prototype.slice;

/**
 * route 单个路由的构造函数
 * @param {String} path 
 */
function Route(path) {
    this.path = path;
    this.methods = {};  // 标识作用，用于是否有指定 method 对应 handler
    this.stack = [];    // 用于存储当前 route 所在的 layer
}

// 查看是否有对应类型的处理方法，避免不必要的遍历执行
Route.prototype.handle_method = function (method) {
    method = method.toLowerCase();
    return this.methods[method];
};

methods.forEach(method => {
    Route.prototype[method] = function () {
        let handlers = slice.call(arguments);
        handlers.forEach(handler => {
            let layer = new Layer('/', handler);
            // 由于此时 path 固定，区分标识就变成了 method
            layer.method = method;   
            this.stack.push(layer);
        });
        this.methods[method] = true;
    };
});

// 第二层的入口 hanlder ，处理第二层的遍历
Route.prototype.dispatch = function (req, res, out) {
    let index = 0, self = this;


    // 此处的 next 是为了执行当前路由的下一个函数
    function next() {
        // 3. 边界处理
        // 注意：在第二层中最后一个 layer 的 next 应该指向下一个第一层 
        if (index >= self.stack.length) {
            // 第二层的 out 是第一层 router.hanlder 中的 next 方法，调用进入下一大层
            return out();
        }

        // 1. 此时遍历的是第二层 layer
        let layer = self.stack[index++];
        // 2. 标识：method
        if (layer.method == req.method.toLowerCase()) {
            layer.handle_request(req, res, next);
        } else {
            next();
        }
    }

    next();
};

module.exports = Route;
