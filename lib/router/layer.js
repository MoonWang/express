/**
 * layer 层的构造函数
 * @param {String} path 路由路径
 * @param {Function} handler 处理函数，第一层 layer 执行时，是 route.disptach ，第二层 layer 执行时，是用户定义路由时的 handler
 */
function Layer(path, handler) {
    this.path = path;
    this.handler = handler;
}

// 判断路径是否匹配当前 layer 实例，一层用
Layer.prototype.match = function (path) {
    // 两种情况：路由、中间件
    if (this.path == path) {
        return true;
    }
    if (!this.route) {
        // 注意匹配严谨
        return path.startWidth(this.path + '/');
    }
};

// 错误判断，一层用
Layer.prototype.handle_error = function(err, req, res, next) {
    // 判断形参个数，只有错误中间件是4个形参
    if (this.handler.length != 4) {
        return next(err);
    }
    this.handler(err, req, res, next);
};

// 为了便于扩展，将 layer.hanlder 封装一层；一二层通用
Layer.prototype.handle_request = function (req, res, next) {
    this.handler(req, res, next);
};

module.exports = Layer;
