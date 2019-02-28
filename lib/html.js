const fs = require('fs');

/**
 * 渲染引擎
 * @param {String} filepath 模板路径
 * @param {Object} options 传入数据
 * @param {Function} callback 回调函数
 */
function render(filepath, options, callback) {
    fs.readFile(filepath, 'utf8', (err, str) => {
        // with 语句，将参数对象添加到内部语句的作用域链顶部，可以减少变量的长度，如 data.a 直接写 a
        let head = "let tpl = ``;\n with (obj) {\n tpl+=`";
        
        // 先替换占位，<%=name%> 替换成 ${name} ，用于后面拼接模板字符串占位
        str = str.replace(/<%=([\s\S]+?)%>/g, function () {
            return "${" + arguments[1] + "}";
        });
        // 剩余 <%if%> 之类的解析成 js 语句，除此之外的内容作为模板字符串的内容
        str = str.replace(/<%([\s\S]+?)%>/g, function () {
            return "`;\n" + arguments[1] + "\n;tpl+=`";
        });

        let tail = "`}\n return tpl; ";
        let html = head + str + tail;
        
        // 形参 data，函数体是个包含函数定义的 js 语句字符串
        let fn = new Function('obj', html);
        
        let result = fn(options);
        callback(null, result);
    });
}
module.exports = render;