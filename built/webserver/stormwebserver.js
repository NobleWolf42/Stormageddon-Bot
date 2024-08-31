var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//oldCode
const https = require('https');
const DiscordOauth2 = require('discord-oauth2');
const { writeFileSync, readFileSync } = require('fs');
const { parse } = require('url');
var currentdate = new Date();
const months = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var privateKey = readFileSync(process.env.oauthPrivateKey, 'utf8');
var certificate = readFileSync(process.env.oauthPublicKey, 'utf8');
var credentials = { key: privateKey, cert: certificate };
const port = process.env.oauthPort;
const oauth = new DiscordOauth2();
function saveUserInfo(accessCode) {
    return __awaiter(this, void 0, void 0, function* () {
        tokenInfo = yield oauth.tokenRequest({
            clientId: process.env.clientId,
            clientSecret: process.env.clientSecret,
            code: accessCode,
            scope: 'identify email connections',
            grantType: 'authorization_code',
            redirectUri: process.env.redirectUri,
        });
        userObj = yield oauth.getUser(tokenInfo.access_token);
        userID = userObj.id;
        finalObj = {};
        userConnections = yield oauth.getUserConnections(tokenInfo.access_token);
        var datetime = months[currentdate.getUTCMonth()] +
            ' ' +
            (currentdate.getUTCDay() + 1) +
            ' ' +
            currentdate.getUTCFullYear() +
            ' @ ' +
            currentdate.getUTCHours() +
            ':' +
            currentdate.getUTCMinutes() +
            ':' +
            currentdate.getUTCSeconds();
        for (i = 0; i < userConnections.length; i++) {
            idnameObj = {};
            if (userConnections[i].verified) {
                idnameObj.id = userConnections[i].id;
                idnameObj.name = userConnections[i].name;
                finalObj[userConnections[i].type] = idnameObj;
            }
        }
        finalObj.time = datetime;
        var oldInfo = require('../data/userInfo.json');
        oldInfo[userID] = finalObj;
        writeFileSync('../data/userInfo.json', JSON.stringify(oldInfo), function (err) {
            if (err) {
                console.log(err);
            }
        });
    });
}
https
    .createServer(credentials, (req, res) => {
    let responseCode = 404;
    let content = '404 Error';
    const urlObj = parse(req.url, true);
    if (urlObj.query.code) {
        const accessCode = urlObj.query.code;
        console.log(accessCode);
        saveUserInfo(accessCode);
    }
    if (urlObj.pathname === '/') {
        responseCode = 200;
        content = readFileSync('./index.html');
    }
    res.writeHead(responseCode, {
        'content-type': 'text/html;charset=utf-8',
    });
    res.write(content);
    res.end();
})
    .listen(port);
export {};
