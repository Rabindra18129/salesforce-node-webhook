require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const jsforce = require('jsforce');
var oauthClient=require('./jsForceHandler/salesForceClient');
var actoinClient=require('./googleActionsHandler/actionClient');
var options;
var port = process.env.PORT || 3000;
var oauthRouter=require('./jsForceHandler/oAuthRouter');
const expApp = express().use(bodyParser.json());
expApp.use(bodyParser.urlencoded());

expApp.use('/oauth',oauthRouter);

expApp.get('/getaccesstoken', function(req,res) {
	console.log('Request came for getAccessToken Callback');
	console.log('query params are-->',req.query);
	var salesforceConnection=new jsforce.Connection({oauth2:oauthClient});
	salesforceConnection.authorize(req.query.code, function(err, userInfo) {
		if (err) { return console.error(err); }
		// Now you can get the access token, refresh token, and instance URL information.
		// Save them to establish connection next time.
		console.log('access token',salesforceConnection.accessToken);
		console.log('refresh token',salesforceConnection.refreshToken);
		console.log(salesforceConnection.instanceUrl);
		console.log("User ID: " + userInfo.id);
		console.log("Org ID: " + userInfo.organizationId);
	  });
	res.send('final');
});


expApp.post('/fulfillment', actoinClient);

expApp.get('/', function (req, res) {
	console.log('Request came for home page');
	res.send('Hello World!');
});
expApp.listen(port, function () {
	
	console.log(`Example app listening on port ! ${port}`);
});
