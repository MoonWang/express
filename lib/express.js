const Router = require('./router');
const Application = require('./application');

function createApplicaton() {
    return new Application();
}

// 用于 express.Router() 的方法创建二级路由
createApplicaton.Router = Router;

module.exports = createApplicaton;
