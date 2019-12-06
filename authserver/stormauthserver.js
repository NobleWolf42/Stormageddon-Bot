const http = require('http');
var DiscordOauth2 = require('discord-oauth2');
const fs = require('fs');
const url = require('url');
var config = require('../data/botconfig.json');
var currentdate = new Date();
var months = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const port = 3000;

var oauth = new DiscordOauth2();

async function saveUserInfo(accessCode){
    tokenInfo = await oauth.tokenRequest({
		clientId: config.general.clientId,
		clientSecret: config.auth.clientSecret,
	 
		code: accessCode,
		scope: "identify email connections",
		grantType: "authorization_code",
		
		redirectUri: config.general.redirectUri
	});

	userObj = await oauth.getUser(tokenInfo.access_token)

	userID = userObj.id;
	finalObj = {};

	userConnections = await oauth.getUserConnections(tokenInfo.access_token);

	var datetime = months[currentdate.getUTCMonth()] + ' ' + (currentdate.getUTCDay() + 1) + " " + currentdate.getUTCFullYear() + " @ " + currentdate.getUTCHours() + ":" + currentdate.getUTCMinutes() + ":" + currentdate.getUTCSeconds();

	for (i = 0; i < userConnections.length; i++) {
		idnameObj = {};

		if (userConnections[i].verified) {
			idnameObj.id = userConnections[i].id;
			idnameObj.name = userConnections[i].name;
			finalObj[userConnections[i].type] = idnameObj;	
		}
	}

	finalObj.time = datetime;

	var oldInfo = require('../data/userinfo.json');

	oldInfo[userID] = finalObj;

	fs.writeFileSync("../data/userinfo.json", JSON.stringify(oldInfo), function(err) {
		if (err) {
			console.log(err);
		}
	});
}

http.createServer((req, res) => {
	let responseCode = 404;
	let content = '404 Error';

	const urlObj = url.parse(req.url, true);

	if (urlObj.query.code) {
		const accessCode = urlObj.query.code;

		console.log(accessCode);
		saveUserInfo(accessCode);
		
	}

	if (urlObj.pathname === '/') {
		responseCode = 200;
		content = fs.readFileSync('./index.html');
	}

	res.writeHead(responseCode, {
		'content-type': 'text/html;charset=utf-8',
	});

	res.write(content);
	res.end();
})
	.listen(port);