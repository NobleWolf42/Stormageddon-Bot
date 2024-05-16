const https = require('https');
const DiscordOauth2 = require('discord-oauth2');
const { writeFileSync, readFileSync } = require('fs');
const { parse } = require('url');
const botConfig = require('../data/botConfig.json');
var currentdate = new Date();
const months = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var privateKey  = readFileSync(botConfig.oauth.privateKey, 'utf8');
var certificate = readFileSync(botConfig.oauth.publicKey, 'utf8');
var credentials = {key: privateKey, cert: certificate};
const port = botConfig.oauth.port;

const oauth = new DiscordOauth2();

async function saveUserInfo(accessCode){
    tokenInfo = await oauth.tokenRequest({
		clientId: botConfig.general.clientId,
		clientSecret: botConfig.auth.clientSecret,
	 
		code: accessCode,
		scope: "identify email connections",
		grantType: "authorization_code",
		
		redirectUri: botConfig.general.redirectUri
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

	var oldInfo = require('../data/userInfo.json');

	oldInfo[userID] = finalObj;

	writeFileSync("../data/userInfo.json", JSON.stringify(oldInfo), function(err) {
		if (err) {
			console.log(err);
		}
	});
}

https.createServer(credentials, (req, res) => {
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