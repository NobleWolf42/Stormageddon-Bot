var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
//oldCode
var https = require('https');
var DiscordOauth2 = require('discord-oauth2');
var _a = require('fs'), writeFileSync = _a.writeFileSync, readFileSync = _a.readFileSync;
var parse = require('url').parse;
var botConfig = require('../data/botConfig.json');
var currentdate = new Date();
var months = [
    'January',
    'Feburary',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];
var privateKey = readFileSync(botConfig.oauth.privateKey, 'utf8');
var certificate = readFileSync(botConfig.oauth.publicKey, 'utf8');
var credentials = { key: privateKey, cert: certificate };
var port = botConfig.oauth.port;
var oauth = new DiscordOauth2();
function saveUserInfo(accessCode) {
    return __awaiter(this, void 0, void 0, function () {
        var datetime, oldInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, oauth.tokenRequest({
                        clientId: botConfig.general.clientId,
                        clientSecret: botConfig.auth.clientSecret,
                        code: accessCode,
                        scope: 'identify email connections',
                        grantType: 'authorization_code',
                        redirectUri: botConfig.general.redirectUri,
                    })];
                case 1:
                    tokenInfo = _a.sent();
                    return [4 /*yield*/, oauth.getUser(tokenInfo.access_token)];
                case 2:
                    userObj = _a.sent();
                    userID = userObj.id;
                    finalObj = {};
                    return [4 /*yield*/, oauth.getUserConnections(tokenInfo.access_token)];
                case 3:
                    userConnections = _a.sent();
                    datetime = months[currentdate.getUTCMonth()] +
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
                    oldInfo = require('../data/userInfo.json');
                    oldInfo[userID] = finalObj;
                    writeFileSync('../data/userInfo.json', JSON.stringify(oldInfo), function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                    return [2 /*return*/];
            }
        });
    });
}
https
    .createServer(credentials, function (req, res) {
    var responseCode = 404;
    var content = '404 Error';
    var urlObj = parse(req.url, true);
    if (urlObj.query.code) {
        var accessCode = urlObj.query.code;
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
