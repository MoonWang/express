/**
 * layer 层的构造函数
 * @param {String} path 路由路径
 * @param {Function} handler 处理函数
 */
function Layer(path, handler) {
    this.path = path;
    this.handler = handler;
}

module.exports = Layer;