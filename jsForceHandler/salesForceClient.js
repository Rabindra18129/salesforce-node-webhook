const jsforce = require('jsforce');
const oauth2 = new jsforce.OAuth2({
    clientId: process.env.SALESFORCE_CONSUMER_KEY,
    clientSecret: process.env.SALESFORCE_CONSUMER_SECRET,
    redirectUri: 'https://salesforce-test-app.cfapps.io/oauth/callback'
});

module.exports = oauth2;