const Layer = require('./layer');

/**
 * route 单个路由的构造函数
 * @param {String} path 
 */
function Route(path) {
    this.path = path;
    this.methods = {};  // 标识作用，用于是否有指定 method 对应 handler
    this.stack = [];    // 用于存储当前 route 所在的 layer
}

Route.prototype.get = function (handler) {
    let layer = new Layer('/', handler);
    layer.method = 'get';
    this.methods['get'] = true;
    this.stack.push(layer);
};

Route.prototype.dispatch = function (req, res, out) {
    
};

module.exports = Route;