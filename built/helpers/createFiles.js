//#region Dependencies
var _a = require('fs'), existsSync = _a.existsSync, writeFileSync = _a.writeFileSync;
//#endregion
//#region Creates missing files on start
/**
 * This function creates the JSON files the bot requires to function if they do not already exist.
 */
function createJSONfiles() {
    var emptyFile = {};
    var d = new Date();
    var emptyLog = {
        logging: [
            {
                Log: 'Rebuilt Log File',
                Date: d,
                Code: 'None',
            },
        ],
    };
    //#region botConfigExample fix this! needs to be .env
    var botConfigExample = {
        auth: {
            token: 'YOUR BOT TOKEN',
            clientSecret: 'YOUR CLIENT SECRET',
            youtubeApiKey: 'YOUR YOUTUBE API KEY',
            soundCloudApiKey: 'YOUR SOUND CLOUD API KEY',
            imgurApiKey: 'YOUR IMGUR API KEY',
            d2ApiKey: 'YOUR DESTINY 2 API KEY',
            spotifyToken: 'YOUR SPOTIFY TOKEN',
            spotifySecret: 'YOUR SPOTIFY SECRET',
        },
        oauth: {
            privateKey: 'LOCATION OF PRIVATE HTTPS KEY',
            publicKey: 'LOCATION OF PUBLIC HTTPS KEY',
            port: 'PORT YOU WANT THE OAUTH SERVER TO USE',
        },
        general: {
            clientID: 'YOUR CLIENT ID',
            redirectURI: 'YOUR REDIRECT URI',
            registerLink: 'YOUR REGISTER URL',
        },
        imgur: {
            clientID: 'YOUR IMGUR CLIENT ID',
            apiCall: 'IMGUR API CALL',
        },
        music: {
            maxPlaylistSize: 0,
            pruning: false,
        },
        devIDs: [
            'YOUR DISCORD IDS 1',
            'YOUR DISCORD IDS 2',
            'YOUR DISCORD IDS 3',
        ],
    };
    //#endregion
    if (!existsSync('./data/botPrefix.json')) {
        writeFileSync('./data/botPrefix.json', JSON.stringify(emptyFile), function (err) {
            if (err) {
                console.log(err);
            }
        });
    }
    if (!existsSync('./data/serverConfig.json')) {
        writeFileSync('./data/serverConfig.json', JSON.stringify(emptyFile), function (err) {
            if (err) {
                console.log(err);
            }
        });
    }
    if (!existsSync('./data/errorLog.json')) {
        writeFileSync('./data/errorLog.json', JSON.stringify(emptyLog), function (err) {
            if (err) {
                console.log(err);
            }
        });
    }
    if (!existsSync('./data/log.json')) {
        writeFileSync('./data/log.json', JSON.stringify(emptyLog), function (err) {
            if (err) {
                console.log(err);
            }
        });
    }
    if (!existsSync('./data/botConfig.json')) {
        writeFileSync('./data/botConfig.json', JSON.stringify(botConfigExample), function (err) {
            if (err) {
                console.log(err);
            }
        });
    }
}
//#endregion
//#region exports
module.exports = { createJSONfiles: createJSONfiles };
//#endregion
