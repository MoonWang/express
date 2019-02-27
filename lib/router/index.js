const url = require('url');
const methods = require('methods');

const Route = require('./route');
const Layer = require('./layer');

const slice = Array.prototype.slice;

// 为了满足 app.use('/user', express.Router()); ，Router 类需要改成普通函数
function Router() {
    function router(req, res, next) {
        router.handler(req, res, next);
    }
    // 继承原型
    Object.setPrototypeOf(router, proto);
    router.stack = [];
    return router;
}

// 创建一个原型对象，拥有原来 Router 类的原型方法，用于给 router 函数继承
let proto = Object.create(null);
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
proto.route = function(path) {
    // 1. 创建 Route 实例
    const route = new Route(path);
    // 2. 创建 Layer 实例
    const layer = new Layer(path, route.dispatch.bind(route));
    layer.route = route;
    // 将 layer 添加到 router.stack ，是整个路由系统的 stack
    this.stack.push(layer);
    return route;
};


// 遍历 methods 类型添加路由规则
methods.forEach(method => {
    proto[method] = function(path) {
        // 先向 router 中添加第一层 layer 
        let route = this.route(path);
        // 再向 route 中添加第二层 layer
        route[method].apply(route, slice.call(arguments, 1));
    };
});

// 服务器路由系统的处理方法
proto.handler = function(req, res, out) {
    // slashAdded 表示是否添加过 / ，removed 表示被移除的字符串 
    let index = 0, self = this, slashAdded = false, removed = '';
    // 测试用例中的 /user/2
    // url 为 '' 时，解析出 pathname 为 null 会报错
    req.url = req.url == '' ? '/' : req.url;
    let { pathname } = url.parse(req.url, true);

    // 此处的 next 是为了执行下一个路由 layer 层
    function next(err) {
        // 将上一次删掉的路由前缀加回来，避免当前匹配路径异常
        if (removed.length > 0) {
            req.url = removed + req.url;
            removed = '';
        }

        // 边界处理，路由匹配完仍未匹配成功
        if(index >= self.stack.length ) {
            // 第一层的 out 是 app.listen 中的 done 方法，调用结束遍历
            return out(err);
        }

        // 先遍历的是第一层 layer 
        let layer = self.stack[index++];

        // 标识：路径，为了匹配路径，给 Layer 加个工具方法 match
        if (layer.match(pathname)) {
            // 没有 route 表明当前层是中间件层
            if (!layer.route) {
                // 需要先处理 url 地址，子路由地址不包括前缀
                // 缓存需要移除的路由地址前缀
                removed = layer.path; // 测试用例中的 /user
                req.url = req.url.slice(removed.length); // /2
                if (err) {
                    layer.handle_error(err, req, res, next);
                } else {
                    layer.handle_request(req, res, next);
                }
            } else { // 路由层
                // 优化：如果 route 里有对应类型的处理方法，才有必要继续遍历第二层 layer
                if (layer.route.handle_method(req.method)) {
                    // 在这里会接受到第二层抛出的 err
                    if (err) {
                        layer.handle_error(err, req, res, next);
                    } else {
                        // 将 layer.parmas 赋值给 req 对象，提供了查询能力
                        req.params = layer.params;

                        // 为了后续方便扩展，不直接调用 layer.handler ，再包装一层
                        // 第一层的 handler 其实就是 route.dispatch 方法
                        layer.handle_request(req, res, next);
                    }
                } else {
                    // 匹配不到则继续匹配下一 layer（第一层）
                    next();
                }
            }
        } else {
            next();
        }
    }

    next();
};

// 添加中间件
proto.use = function(path, handler) {
    // 参数兼容处理
    if (typeof handler != 'function') {
        handler = path;
        path = '/';
    }

    // use 也是创建一个 layer 层放到 router.stack 中
    let layer = new Layer(path, handler);
    // 中间件的层，没有路由。
    // 注：正是通过 layer.route 是否存在来判断是路由函数还是中间件函数
    layer.route = undefined;
    this.stack.push(layer);
};

module.exports = Router;
