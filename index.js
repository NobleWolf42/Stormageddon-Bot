const http = require('http');
const fs = require('fs');
const url = require('url');
const fetch = require('node-fetch');
const FormData = require('form-data');

const port = 3000;

http.createServer((req, res) => {
	let responseCode = 404;
	let content = '404 Error';

	const urlObj = url.parse(req.url, true);

	if (urlObj.query.code) {
		const accessCode = urlObj.query.code;
		const data = new FormData();

		data.append('client_id', '648179533115293697');
		data.append('client_secret', 'LlQ3WZ0GcX2RtTxsT4u830OwoYpuV8QI');
		data.append('grant_type', 'authorization_code');
		data.append('redirect_uri', 'http://noblewolf42.com:3000');
		data.append('scope', 'connections identify email');
		data.append('code', accessCode);

		fetch('https://discordapp.com/api/oauth2/token', {
			method: 'POST',
			body: data,
		})
			.then(discordRes => discordRes.json())
			.then(info => {
				console.log(info);
				return info;
			})
			.then(info => fetch('https://discordapp.com/api/users/@me/connections', {
				headers: {
					authorization: `${info.token_type} ${info.access_token}`,
				},
			}))
			.then(userRes => userRes.json())
			.then(console.log);
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