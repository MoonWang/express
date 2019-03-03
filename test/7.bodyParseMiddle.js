let express = require('express');
// let bodyParser = require('body-parser');
let bodyParser = require('./middleware/body-parser');

let app = express();

// 支持 application/json
app.use(bodyParser.json());
// 支持 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// 支持 text/plain
app.use(bodyParser.text());

app.post('/user', (req, res) => {
    let body = req.body;
    console.log(body);
    res.send(body);
    res.end();
});

app.listen(8080);