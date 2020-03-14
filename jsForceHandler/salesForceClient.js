const jsforce = require('jsforce');
const oauth2 = new jsforce.OAuth2({
    clientId: process.env.SALESFORCE_CONSUMER_KEY,
    clientSecret: process.env.SALESFORCE_CONSUMER_SECRET,
    redirectUri: 'http://localhost:3000/getaccesstoken'
});

module.exports=oauth2;