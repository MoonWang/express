// const express = require('express');
const express = require('../lib/express');
const app = express();

app.get('/', (req, res) => {
    res.end('hello express');
});

app.listen(8080);