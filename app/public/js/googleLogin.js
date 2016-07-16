/**
* Handler for the signin callback triggered after the user selects an account.
*/

function onSignInCallback(resp) {
    if (resp['status']['signed_in'] && resp['status']['method'] == 'PROMPT'){
        gapi.client.load('plus', 'v1', apiClientLoaded);
    }
}

/**
* Sets up an API call after the Google API client loads.
*/
function apiClientLoaded() {
    gapi.client.plus.people.get({userId: 'me'}).execute(handleEmailResponse);
}

/**
* Response callback for when the API client receives a response.
*
* @param resp The API response object with the user email and profile information.
*/
function handleEmailResponse(resp) {
    var primaryEmail;
    for (var i=0; i < resp.emails.length; i++) {
        if (resp.emails[i].type === 'account') primaryEmail = resp.emails[i].value;
    }
    angular.element(document.getElementById('gConnect')).scope().checkEmail(primaryEmail, resp);
}
