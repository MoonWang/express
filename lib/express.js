const Router = require('./router');
const Application = require('./application');

function createApplicaton() {
    return new Application();
}

createApplicaton.Router = Router;

module.exports = createApplicaton;
