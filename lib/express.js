const Router = require('./router');
const Application = require('./application');

function createApplicaton() {
    return new Application();
}

createApplicaton.Router = Router;

module.exports = createApplicaton;

/*const http = require('http');
const url = require('url');

// 1.1 router 是路由规则队列，默认存入一条通用规则
let router = [{
    path: '*',
    method: '*',
    handler(req, res) {
        res.end(`Cannot ${req.method} ${req.url}`);
    }
}];

function createApplication() {

    // 1.0 express() 返回一个 app 对象，有 app.get 和 app.listen 方法
    return {
        // 1.2 get 方法将路由规则缓存
        get(path, handler) {
            router.push({
                path,
                method: 'get',
                handler
            });
        },
        // 1.3 listen 方法创建 HTTP 服务器，处理客户端请求
        listen() {
            let server = http.createServer((req, res) => {
                let { pathname } = url.parse(req.url, true);
                // 说明：router[0] 是个默认处理，应该放到最后，所以从1开始遍历
                for(let i = 1; i < router.length; i++) {
                    let { path, method, handler } = router[i];
                    if(path == pathname && method == req.method.toLowerCase()) {
                        return handler(req, res);
                    }
                }
                // 匹配不到，则执行默认规则
                router[0].handler(req, res);
            });

            // 将 app.listen 的参数直接传递给 httpServer 实例的 listen 方法
            server.listen.apply(server, arguments);
        }
    };
}

module.exports = createApplication;*/