import {clientID, secretClient} from "../../spotify_keys.ts"
const HTML_URL_SPACE_ENCODING = '%20';

//getting access token for application\
async function getAccessToken(clientID: string, secretClient: string){
    var authParameters = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials&client_id=' + clientID + '&client_secret=' + secretClient
    }

    const temp = await fetch('https://accounts.spotify.com/api/token', authParameters)
    .then(result => result.json())
    .then(data => data.access_token);

    return temp;
}

//getting authorization for access to current users account
/*
auth flow explained:
build custom auth request url using keys
clicking button redirects user to spotifies page
when user allows access the spotify page uses the redirect_uri we
    passed in to send us back to the mixers app

*/
let redirect_uri = "http://localhost:5173/";
const AUTHORIZE_URL = "https://accounts.spotify.com/authorize?";
const TOKEN_URL = "https://accounts.spotify.com/api/token";

function requestAuthorization(){
    //scopes are permissions we want
    let scopes = ['playlist-read-private', //read private pl
                  'playlist-read-collaborative', //read collab pl
                  'playlist-modify-private', //modify private pls
                  'playlist-modify-public', //modify public pls
                  'user-follow-read', //know which accs you follow
                  'user-top-read', //read your top songs
                  'user-read-recently-played', //read recent listening activity
                  'user-library-modify', //make playlists
                  'user-library-read', //read other items in library (likes songs, albums, podcasts, etc)
                  'user-read-private'] //read profile
    let url = AUTHORIZE_URL;
    url += "client_id=" + clientID;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog=true";
    url += "&scope=" + scopes.join(HTML_URL_SPACE_ENCODING);
    window.location.href = url;   
}

function onPageLoad(){
    if(window.location.search.length > 0){
        handleRedirect();
    }
}

function handleRedirect(){
    let code = getCode();
    fetchAccessToken(code);
    window.history.pushState("", "", redirect_uri);
}

function fetchAccessToken(code: string | null){
    let body = 'grant_type=authorization_code';
    body += "&code=" + code;
    body += "&redirect_uri=" + encodeURI(redirect_uri);
    body += "&client_id" + clientID;
    body += "&client_secret=" + secretClient;
    callAuthorizationAPI(body)
}

function callAuthorizationAPI(body: string){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN_URL, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(clientID + ':' + secretClient));
    xhr.send(body);
    xhr.onload = () => {
        //handleAuthorizationResponse
        if( xhr.status == 200){
            let data = JSON.parse(xhr.responseText);
            console.log(data);
            if(data.access_token != undefined){
                //access_token = data.access_token;
                //localStorage.setItem("access_token", data.access_token);
                console.log("access_token: " + data.access_token);
            }
            if(data.refresh_token != undefined ){
                //refresh_token = data.refresh_token;
                //localStorage.setItem("refresh_token", data.refresh_token);
                console.log("refresh_token: " + data.refresh_token);
            }
            //onPageLoad();
        }else{
            console.log(xhr.responseText);
            alert(xhr.responseText);
        }
    }
}

function getCode(){
    let code = null;
    const queryString = window.location.search;
    if(queryString.length > 0){
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code');
    }
    return code;
}


//actual api calls


export {getAccessToken, requestAuthorization, onPageLoad};