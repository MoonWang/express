let url = require('url');
let fs = require('fs');
let path = require('path');
let http = require('http');

let mime = require('mime');

function static(root, options = {}) {
    let {
        dotfiles = 'ignore',
        redirect = true,
        index = 'index.html',
        extensions = false,
        etag = true,
        lastModified = true,
        maxAge = 0,
        setHeaders
    } = options;
    
    function serve_static(req, res, next) {
        let { pathname } = url.parse(req.url, true);
        let file = path.join(root, pathname);

        // 2. 判断点文件
        let lastPath = file.split(path.sep).pop();
        if(dotfiles != 'allow' && lastPath[0] == '.') {
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


        fs.stat(file, (err, stats) => {
            if(err) {
                // 4. 设置 extension
                if(lastPath.indexOf('.') == -1 && Array.isArray(extensions)) {
                    for(let i = 0; i < extensions.length; i++) {
                        let url = pathname + '.' + extensions[i];
                        let file = path.join(root, url);
                        try {
                            fs.statSync(file);
                            req.url = url;
                            return serve_static(req, res, next);
                        } catch(e) {}
                    }
                    return next();
                } else {
                    return next();
                }
            }
            // 3.1 判断是否为目录
            if(stats.isDirectory()) {
                // 3.1 重定向 / 
                if(redirect && !file.endsWith('/')) {
                    res.writeHead(301, { 'Location': pathname + '/' });
                    return res.end(http.STATUS_CODES[301]);;
                } else {
                    next();
                }
                // 3.2 允许目录访问
                if(index === false) {
                    res.statusCode = 403;
                    return res.end(http.STATUS_CODES[403]);
                } else {
                    file += index;
                }
            }
            // 5. 设置缓存相关
            if (etag) {
                let mtime = stats.mtime.getTime().toString(16)
                let size = stats.size.toString(16);
                res.setHeader('ETag', '"' + size + '-' + mtime + '"');
            }
            if (lastModified) {
                res.setHeader('Last-Modified', stats.mtime.toUTCString());
            }
            res.setHeader('Cache-Control', `max-age=${maxAge}`);

            // 1.2 根据 mime 类型设置响应头
            let contentType = mime.getType(pathname);
            res.setHeader('Content-Type', contentType);

            // 6. 调用用户传入方法
            if(setHeaders) {
                setHeaders(res, pathname, stats);
            }

            // 1.1 基础服务
            fs.createReadStream(file).pipe(res);
        })
    };

    return serve_static;
}

module.exports = static;