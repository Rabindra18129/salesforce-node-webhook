const jsforce = require('jsforce');
var instanceUrl = process.env.INSTANCE_URL;


function apexgethandler(url, accessToken) {
    return new Promise(async(resolve, reject) => {
        try {
            var conn = new jsforce.Connection({ instanceUrl: instanceUrl, accessToken: accessToken });
            console.log(`Instance url is ${conn.instanceUrl}`);
            var response = await conn.apex.get(url);
            console.log('Response from salesforce', response);
            resolve(response);
        } catch (error) {
            console.log('Error happened in apex call', error);
            reject(`Not able to do task due to ${error.message}`);

        }
    });
}

module.exports = { getHandler: apexgethandler };