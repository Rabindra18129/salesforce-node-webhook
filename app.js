require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
var actoinClient = require('./googleActionsHandler/actionClient');
var port = process.env.PORT || 3000;
var oauthRouter = require('./jsForceHandler/oAuthRouter');
const expApp = express().use(bodyParser.json());
expApp.use(bodyParser.urlencoded());

expApp.use('/oauth', oauthRouter);

expApp.post('/fulfillment', actoinClient);

expApp.get('/', function(req, res) {
    console.log('Request came for home page');
    res.send('Hello World!');
});
expApp.listen(port, function() {

    console.log(`Example app listening on port ! ${port}`);
});