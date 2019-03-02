let url = require('url');
let fs = require('fs');
let path = require('path');
let http = require('http');

let mime = require('mime');

function static(root, options = {}) {
    let {
        dotfiles = 'ignore'
    } = options;
    
    return function(req, res, next) {
        let { pathname } = url.parse(req.url, true);
        let file = path.join(root, pathname);

        // 2. 判断点文件
        let pathArr = file.split(path.sep);
        if(dotfiles != 'allow' && pathArr.pop()[0] == '.') {
            res.setHeader('Content-Type', 'text/html');
            if(dotfiles == 'deny')  {
                res.statusCode = 403;
                return res.end(http.STATUS_CODES[403]);
            }
            if(dotfiles == 'ignore')  {
                res.statusCode = 404;
                return res.end(http.STATUS_CODES[404]);
            }
        }

        // 1.2 根据 mime 类型设置响应头
        let contentType = mime.getType(pathname);
        res.setHeader('Content-Type', contentType);

        fs.stat(file, (err, stat) => {
            if(err) {
                return next();
            }
            // 1.1 基础服务
            fs.createReadStream(file).pipe(res);
        })
    };
}

module.exports = static;