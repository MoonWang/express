// 测试 body-parse 中间件
let http = require('http');
let zlib = require('zlib');

let querystring = require('querystring');
let qs = require('qs');
let iconv = require('iconv-lite');

// 4.1 测试编码
// let encoding = 'gbk';
let encoding = 'gb-2312';

// 5.1 测试压缩
let zlibType = 'gzip';

let options = {
    host: 'localhost',
    port: 8080,
    method: 'POST',
    path: '/user',
    headers: {
        // 1.1 测试 json
        // 'Content-Type': "application/json"
        // 2.1 测试 urlencoded
        // 'Content-Type': "application/x-www-form-urlencoded"
        // 3.1 测试 text
        // 'Content-Type': "text/plain"
        // 4.2 测试编码
        'Content-Type': "text/plain;charset=" + encoding,
        // 5.1 测试压缩
        'Content-Encoding': zlibType
    }
}
let req = http.request(options, res => {
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`响应主体: ${chunk}`);
    });
    res.on('end', () => {
        console.log('响应中已无数据');
    });
});

req.on('error' , err => {
    console.log(err);
});

let postData;
// 1.2 测试 json
// postData = JSON.stringify({
//     'msg': 'moon 王'
// });
// 2.2 测试 urlencoded
// let testData = {
//     msg: 'moon 王',
//     other: {
//         age: 18
//     }
// };
// postData = querystring.stringify(testData);
// postData = qs.stringify(testData);
// 3.2 测试 text/plain
postData = 'moon 王';
// 4.3 测试编码
postData = iconv.encode(postData, encoding);

// 将数据写入请求主体。
// req.write(postData);
// req.end();

// 5.3 测试压缩
zlib[zlibType](postData, (err, data) => {
    req.end(data);
});