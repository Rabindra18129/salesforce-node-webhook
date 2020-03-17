var oauthRouter = require('express').Router();
var oauthClient = require('./salesForceClient');
var uuid = require('uuid/v4');
var timeOut = 300;
oauthRouter.get('/authorize', (req, res) => {
    var queryParams = req.query;
    console.log('Request came for Authorization code');
    console.log('Query params are', queryParams);
    res.redirect(oauthClient.getAuthorizationUrl({ state: queryParams.state }));
});
oauthRouter.get('/callback', (req, res) => {
    var queryParams = req.query;
    console.log('Request came for access callback');
    console.log('Query params in callback uri is ', req.query);
    let redirectUri = `${process.env.GOOGLE_REDIRECT_URI}code=${queryParams.code}&state=${queryParams.state}`;
    console.log('Google redirecturi is ', redirectUri);
    res.redirect(redirectUri);
});

oauthRouter.post('/token', function(req, res) {
    console.log('Request came for accecctoken');
    console.log('query params are-->', req.body);
    res.setHeader('Content-Type', 'application/json');
    if (req.body.client_id != process.env.SALESFORCE_CONSUMER_KEY) {
        console.log('Invalid Client ID');
        return res.status(400).send('Invalid Client ID');
    }
    if (req.body.client_secret != process.env.SALESFORCE_CONSUMER_SECRET) {
        console.log('Invalid Client Ksecret');
        return res.status(400).send('Invalid Client ID');
    }
    if (req.body.grant_type) {
        if (req.body.grant_type == 'authorization_code') {
            console.log('Fetching token from salesforce');
            oauthClient.requestToken(req.body.code, (err, tokenResponse) => {
                if (err) {
                    console.log(err.message);
                    return res.status(400).json({ "error": "invalid_grant" });
                }
                var googleToken = {
                    token_type: tokenResponse.token_type,
                    access_token: tokenResponse.access_token,
                    refresh_token: tokenResponse.refresh_token,
                    expires_in: timeOut
                };
                console.log('Token response for auth code', googleToken);
                res.status(200).json(googleToken);

            });
        } else if (req.body.grant_type == 'refresh_token') {
            console.log('Fetching refresh token from salesforce');
            oauthClient.refreshToken(req.body.refresh_token, (err, tokenResponse) => {
                if (err) {
                    console.log(err.message);
                    return res.status(400).json({ "error": "invalid_grant" });
                }
                var googleToken = { token_type: tokenResponse.token_type, access_token: tokenResponse.access_token, expires_in: timeOut };
                console.log('Token response for auth code', googleToken);
                res.status(200).json(googleToken);
            });
        }
    } else {
        res.send('Invalid parameter');
    }
});
module.exports = oauthRouter;