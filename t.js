var express = require('express');
var app = express();

var token = { access_toke: '1234', refresh_token: '12345', expires_in: 300 };
app.get('/', (req, res) => {
    res.status(200).send(token);
});

app.listen(5000, () => {});