//#region Dependencies
import { existsSync, writeFileSync } from 'fs';
//#endregion

//#region Creates missing files on start
/**
 * This function creates the JSON files the bot requires to function if they do not already exist.
 */
async function createJSONfiles() {
    const d = new Date();
    const emptyLog = {
        logging: [
            {
                Log: 'Rebuilt Log File',
                Date: d,
                Code: 'None',
            },
        ],
    };

    //#region botConfigExample
    const botConfigExample = 'authToken = "YOUR-AUTH-TOKEN"\nclientID = "YOUR_CLIENT_ID"\nd2ApiKey = "YOUR_D2_API_KEY"\ndevIDs = ["YOUR_DEV_IDS"]\nmongoDBURI = "YOUR_MONGO_DB_URI"';
    //#endregion

    if (!existsSync('../../data/errorLog.json')) {
        writeFileSync('../../data/errorLog.json', JSON.stringify(emptyLog));
    }

    if (!existsSync('../../data/log.json')) {
        writeFileSync('../../data/log.json', JSON.stringify(emptyLog));
    }

    if (!existsSync('../../.env')) {
        writeFileSync('../../.env', botConfigExample);
    }
}
//#endregion

//#region exports
export { createJSONfiles };
//#endregion
