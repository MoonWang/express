const pathToRegexp = require('path-to-regexp');

/**
 * layer 层的构造函数
 * @param {String} path 路由路径
 * @param {Function} handler 处理函数，第一层 layer 执行时，是 route.disptach ，第二层 layer 执行时，是用户定义路由时的 handler
 */
function Layer(path, handler) {
    this.path = path;
    this.handler = handler;

    // 将路径拆分成 keys 和 regexp 用于后续匹配路径时的判断
    this.keys = [];
    this.regexp = pathToRegexp(this.path, this.keys);
}

// 判断路径是否匹配当前 layer 实例，一层用
Layer.prototype.match = function (path) {
    // 两种情况：路由、中间件
    if (this.path == path) {
        return true;
    }
    // 非路由，那就是中间件
    if (!this.route) {
        // 注意匹配严谨
        return path.startsWith(this.path + '/');
    }
    // 是路由，使用定义路由 layer 时生成的正则来匹配
    if (this.route) {
        let matches = this.regexp.exec(path);
        if (matches) {
            // 匹配成功时，根据 匹配结果 和 定义路由时生成的 keys 一起生成最终的 params 
            this.params = {};
            // 注意：matchers[0] 是匹配结果字符串
            for (let i = 1; i < matches.length; i++) {
                let name = this.keys[i - 1].name;
                let val = matches[i];
                this.params[name] = val;
            }
            return true;
        }
    }
    return false;
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
