var oauthRouter=require('express').Router();
var oauthClient=require('./salesForceClient');

oauthRouter.get('/authorize',(req,res)=>{
    console.log('Request came for Authorization code');
    console.log('Query params are',req.query);
    res.redirect(oauthClient.getAuthorizationUrl({}));
});

oauthRouter.get('/getAccessToken', function(req,resp) {
	console.log('Request came for getAccessToken Callback');
	console.log('query params are-->',req.query);

	// const oauth2 = new jsforce.OAuth2({
	// 	clientId: process.env.SALESFORCE_CONSUMER_KEY,
	// 	clientSecret: process.env.SALESFORCE_CONSUMER_SECRET,
	// 	redirectUri: 'https://sfdcadminbot.herokuapp.com/getAccessToken'
	// });

	// const conn = new jsforce.Connection({ oauth2 : oauth2 });
	// 	console.log('req query code '+req.query.code);
	// 	conn.authorize(req.query.code, function(err, userInfo) {
	// 	if (err) {
    //         console.log('Error happened at authorization-->',err);
	// 		return resp.send(err.message);
	// 	}
	// 	const conn2 = new jsforce.Connection({
	// 		instanceUrl : conn.instanceUrl,
	// 		accessToken : conn.accessToken
	// 	});
	// 	conn2.identity(function(err, res) {
	// 	if (err) { 
    //         console.log('Error happened at identity-->',err);
    //         return resp.send(err.message); 
    //     }
	// 	  console.log("user ID: " + res.user_id);
	// 	  console.log("organization ID: " + res.organization_id);
	// 	  console.log("username: " + res.username);
	// 	  console.log("display name: " + res.display_name);
	// 	  options = { Authorization: 'Bearer '+conn.accessToken};
	// 	  resp.redirect(`https://oauth-redirect.googleusercontent.com/r/YOUR_PROJECT_ID?code=${req.query.code}&state=true`);
	// 	});
	// });
	res.send('final');
});

module.exports=oauthRouter;