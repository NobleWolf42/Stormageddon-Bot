//#region Dependencies
import { existsSync, writeFileSync } from 'fs';
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
    if (!existsSync('./data/errorLog.json')) {
        writeFileSync('./data/errorLog.json', JSON.stringify(emptyLog));
    }
    if (!existsSync('./data/log.json')) {
        writeFileSync('./data/log.json', JSON.stringify(emptyLog));
    }
    if (!existsSync('.env')) {
        writeFileSync('.env', botConfigExample);
    }
}
//#endregion
//#region exports
export { createJSONfiles };
//#endregion
