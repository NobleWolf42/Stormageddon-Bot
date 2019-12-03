const http = require('http');
var DiscordOauth2 = require('discord-oauth2');
const fs = require('fs');
const url = require('url');
var config = require('./config.json');

const port = 3000;

var oauth = new DiscordOauth2();

async function saveUserInfo(accessCode){
    tokenInfo = await oauth.tokenRequest({
		clientId: "645141555719569439",
		clientSecret: config.auth.clientSecret,
	 
		code: accessCode,
		scope: "identify email connections",
		grantType: "authorization_code",
		
		redirectUri: "http://localhost:3000/"
	});

	userObj = await oauth.getUser(tokenInfo.access_token)

	userID = userObj.id;
	finalObj = {};

	userConnections = await oauth.getUserConnections(tokenInfo.access_token);

	console.log(userID);
	
	console.log(userConnections.length);

	for (i = 0; i < userConnections.length; i++) {
		idnameObj = {};

		if (userConnections[i].verified) {
			idnameObj.id = userConnections[i].id;
			idnameObj.name = userConnections[i].name;
			finalObj[userConnections[i].type] = idnameObj;	
		}
	}

	var oldInfo = require('./userinfo.json');

	oldInfo[userID] = finalObj;

	fs.writeFile("userinfo.json", JSON.stringify(oldInfo), function(err) {
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