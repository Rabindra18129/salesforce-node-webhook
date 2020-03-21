const { dialogflow } = require('actions-on-google');
const {
    SimpleResponse,
    BasicCard,
    SignIn,
    Image,
    Suggestions,
    Button
} = require('actions-on-google');

var apexHandler = require('../jsForceHandler/apexHandler');
const app = dialogflow();


app.intent('Default Welcome Intent', (conv) => {
    console.log('Request came for account link flow start');
    if (!conv.user.accessToken) {
        conv.ask(new SignIn());
    } else {
        conv.ask('You are already sign in ');
    }

});

app.intent('Get SignIn Info', (conv, params, signin) => {
    console.log('Sign in info Intent');
    console.log('Sign in content-->', signin);
    if (signin.status === 'OK') {
        const access = conv.user.access.token // possibly do something with access token
        conv.ask('Great, thanks for signing in! What do you want to do next?')
    } else {
        conv.ask(`I won't be able to save your data, but what do you want to do next?`)
    }
});

app.intent('Get Records', (conv) => {
    conv.ask('Records are ...');
    conv.close();
});

app.intent('Get Opportunity Info', (conv, { oppName, fieldNames }) => {

    const opName = conv.parameters['oppName'];
    const fldNames = conv.parameters['fieldNames'];

    console.log('**conv parameters oppName** ' + opName);
    console.log('**conv parameters fieldNames** ' + fldNames);

    return oppInfo(opName, fldNames).then((resp) => {
        conv.ask(new SimpleResponse({
            speech: resp,
            text: resp,
        }));
    });
});

app.intent('TaskCreate', async(conv) => {

    const opName = 'emphasis';
    const tskSbj = 'call';
    const tskPr = '';
    const conFName = 'karen';
    console.log('User details-->', conv.user.access.token);

    try {
        var result = await apexHandler.getHandler(`/createTask?oppName=${opName}&taskSubject=${tskSbj}&taskPriority=${tskPr}&contactFirstName=${conFName}`, conv.user.access.token);
        conv.close('Response from Salesforce', result);
    } catch (error) {
        conv.close('Not able to create task');
    }
    conv.close('task created successfully');
});

app.intent('Log Meeting Notes', (conv, { meetingNotes }) => {

    const meetingNt = conv.parameters['meetingNotes'];
    console.log('*** con context ** ' + conv.contexts);
    const opName = conv.contexts.get('createtaskonopportunity-followup').parameters['oppName'];
    const conFName = conv.contexts.get('createtaskonopportunity-followup').parameters['contactFirstName']

    return logMeeting(meetingNt, opName, conFName).then((resp) => {
        conv.ask(new SimpleResponse({
            speech: resp,
            text: resp,
        }));
    });
});

app.intent('Update Opportunity', (conv, { fieldNames, fieldValues }) => {

    const fldNames = conv.parameters['fieldNames'];
    const fldVal = conv.parameters['fieldValues'];
    const opName = conv.contexts.get('createtaskonopportunity-followup').parameters['oppName'];

    return updateOppty(fldNames, fldVal, opName).then((resp) => {
        conv.ask(new SimpleResponse({
            speech: resp,
            text: resp,
        }));

        conv.ask('Would you like to setup a follow up meeting later today');
        conv.ask(new Suggestions('Yes', 'No'));
    });
});

app.intent('Update Opportunity - yes', (conv) => {

    const opName = conv.contexts.get('createtaskonopportunity-followup').parameters['oppName'];
    const conFName = conv.contexts.get('createtaskonopportunity-followup').parameters['contactFirstName']

    return logMeetingToday('follow up meeting', opName, conFName).then((resp) => {
        conv.ask(new SimpleResponse({
            speech: resp,
            text: resp,
        }));
    });
});

module.exports = app;