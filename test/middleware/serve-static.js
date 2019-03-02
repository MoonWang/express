let url = require('url');
let fs = require('fs');
let path = require('path');

let mime = require('mime');

function static(root, options = {}) {

    return function(req, res, next) {
        let { pathname } = url.parse(req.url, true);
        let file = path.join(root, pathname);

        let contentType = mime.getType(pathname);
        res.setHeader('Content-Type', contentType);

        fs.stat(file, (err, stat) => {
            if(err) {
                return next();
            }

            fs.createReadStream(file).pipe(res);
        })
    };
}

module.exports = static;