/**
 * layer 层的构造函数
 * @param {String} path 路由路径
 * @param {Function} handler 处理函数，第一层 layer 执行时，是 route.disptach ，第二层 layer 执行时，是用户定义路由时的 handler
 */
function Layer(path, handler) {
    this.path = path;
    this.handler = handler;
}

// 判断路径是否匹配当前 layer 实例
Layer.prototype.match = function (path) {
    return this.path == path;
};

// 为了便于扩展，将 layer.hanlder 封装一层
Layer.prototype.handle_request = function (req, res, next) {
    this.handler(req, res, next);
};

module.exports = Layer;
