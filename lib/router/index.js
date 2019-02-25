const Route = require('./route');
const Layer = require('./layer');

function Router() {
    this.stack = [];
}

/**
 * 所属层级描述
 * Router
 *   stack 数组
 *     path + route.dispath -> layer ，特殊属性 route 就是下面这个
 *       path -> route ，特殊属性 method 标识是否有对应的 handler
 *         stack 数组
 *           path '/' + handler -> layer ，
 */

// 使用 path 创建一个 route，并存储相应关系
Router.prototype.route = function(path) {
    // 1. 创建 Route 实例
    const route = new Route(path);
    // 2. 创建 Layer 实例
    const layer = new Layer(path, route.dispatch.bind(route));
    layer.route = route;
    // 将 layer 添加到 router.stack ，是整个路由系统的 stack
    this.stack.push(layer);
    return route;
};

// 处理 get 请求的路由配置
Router.prototype.get = function(path, handler) {
    let route = this.route(path);
    route.get(handler);
};

// 服务器路由系统的处理方法
Router.prototype.handler = function(req, res, out) {
    console.log('处理');
};

module.exports = Router;
