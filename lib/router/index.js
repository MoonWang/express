const url = require('url');

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
    // 先向 router 中添加第一层 layer 
    let route = this.route(path);
    // 再向 route 中添加第二层 layer
    route.get(handler);
};

// 服务器路由系统的处理方法
Router.prototype.handler = function(req, res, out) {
    // next 函数交给路由 hanlder 来主动调用，用于继续执行
    let index = 0, self = this;
    let { pathname } = url.parse(req.url, true);

    // 此处的 next 是为了执行下一个路由 layer 层
    function next() {
        // 3. 边界处理，路由匹配完仍未匹配成功
        if(index >= self.stack.length ) {
            // 第一层的 out 是 app.listen 中的 done 方法，调用结束遍历
            return out();
        }

        // 1. 先遍历的是第一层 layer 
        let layer = self.stack[index++];
        // 2. 标识：路径，为了匹配路径，给 Layer 加个工具方法 match
        // 优化：如果 route 里有对应类型的处理方法，才有必要继续遍历第二层 layer
        if (layer.match(pathname) && layer.route && layer.route.handle_method(req.method)) {
            // 为了后续方便扩展，不直接调用 layer.handler ，再包装一层
            // 第一层的 handler 其实就是 route.dispatch 方法
            layer.handle_request(req, res, next);
        } else {
            // 匹配不到则继续匹配下一 layer（第一层）
            next();
        }
    }

    next();
};

module.exports = Router;
