"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJSONfiles = createJSONfiles;
//#region Dependencies
var fs_1 = require("fs");
//#endregion
//#region Creates missing files on start
/**
 * This function creates the JSON files the bot requires to function if they do not already exist.
 */
function createJSONfiles() {
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
    //#region botConfigExample
    var botConfigExample = 'authToken = "YOUR-AUTH-TOKEN"\nclientID = "YOUR_CLIENT_ID"\nd2ApiKey = "671b3211756445cbb83b5d82f6682ebd"\ndevIDs = ["201665936049176576"]\nmongoDBURI = "mongodb+srv://stormyAdmin:KkIO3kH7DCXLvRco@stormageddon-bot.mtf5p.mongodb.net/?retryWrites=true&w=majority&appName=Stormageddon-Bot"';
    //#endregion
    if (!(0, fs_1.existsSync)('./data/errorLog.json')) {
        (0, fs_1.writeFileSync)('./data/errorLog.json', JSON.stringify(emptyLog));
    }
    if (!(0, fs_1.existsSync)('./data/log.json')) {
        (0, fs_1.writeFileSync)('./data/log.json', JSON.stringify(emptyLog));
    }
    if (!(0, fs_1.existsSync)('.env')) {
        (0, fs_1.writeFileSync)('.env', botConfigExample);
    }
}
//#endregion
