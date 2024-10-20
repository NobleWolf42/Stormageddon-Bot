var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//#region Dependencies
import { existsSync, writeFileSync } from 'fs';
//#endregion
//#region Creates missing files on start
/**
 * This function creates the JSON files the bot requires to function if they do not already exist.
 */
function createJSONfiles() {
    return __awaiter(this, void 0, void 0, function* () {
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
        if (!existsSync('../data/errorLog.json')) {
            writeFileSync('../data/errorLog.json', JSON.stringify(emptyLog));
        }
        if (!existsSync('../data/log.json')) {
            writeFileSync('../data/log.json', JSON.stringify(emptyLog));
        }
        if (!existsSync('../.env')) {
            writeFileSync('../.env', botConfigExample);
        }
    });
}
//#endregion
//#region exports
export { createJSONfiles };
//#endregion
