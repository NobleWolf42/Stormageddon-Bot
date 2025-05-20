//#region Imports
import { EmbedBuilder } from 'discord.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { capitalize } from './stringHelpers.js';
import { Log, LogType } from '../models/loggingModel.js';
//#endregion
//#region stupid constants to make the __dirname work
const __dirname = resolve();
//#endregion
//#region Error Logs TODO FIX this it needs to not be global
let errorLogFile = JSON.parse(readFileSync(resolve(__dirname, './data/errorLog.json')).toString());
let logFile = JSON.parse(readFileSync(resolve(__dirname, './data/log.json')).toString());
//#endregion
//#region Function that adds an item to the log file and sends any fatal errors to the bot developers
/**
 * This function adds an item to the log file and sends any fatal errors to the bot developers.
 * @param logType - Type of log "success", "warning", "alert", or "fatal error"
 * @param command String of the command name that was executed
 * @param user - String of the user who executed the command
 * @param server - String of the server name that the command was executed in
 * @param channel - String of the channel name that the command was executed in
 * @param error - String containing error
 * @param client - Discord.js Client Object
 */
function addToLog(logType, command, user, server, channel, error, client) {
    try {
        reloadLog();
        const logAdd = new Log(logType);
        if (logType === LogType.Success || logType === LogType.Warning) {
            logAdd.Log = `${capitalize(logType)} - Command: ${capitalize(command)} Attempted By: ${user} in "${server}"#${channel}`;
        }
        else {
            logAdd.Log = `${capitalize(logType)} - Command: ${capitalize(command)} Attempted By: ${user} in "${server}"#${channel} --- Error: ${error}`;
        }
        console.log(logAdd.Log);
        console.log('');
        if (logType === LogType.Success || logType === LogType.Warning) {
            logFile.logging[logFile.logging.length] = logAdd;
            addInput(logType);
            return;
        }
        errorLogFile.logging[errorLogFile.logging.length] = logAdd;
        const devList = process.env.devIDs.split(',');
        for (const key of devList) {
            const embMsg = new EmbedBuilder().setDescription(`${logAdd.Log}`).setTimestamp();
            if (logType === LogType.FatalError) {
                embMsg.setTitle('Fatal Errors Detected!');
                embMsg.setColor('#FF0084');
            }
            else {
                embMsg.setTitle('Alert!');
                embMsg.setColor('#A06700');
            }
            client.users.send(key, {
                embeds: [embMsg],
                files: [
                    {
                        attachment: './data/errorLog.json',
                        name: 'errorLog.json',
                    },
                ],
            });
        }
    }
    catch (err) {
        console.error(err);
        console.log('');
    }
}
//#endregion
//#region Function that saves the current state of the logFile buffer to ./data/errorLog.json
/**
 * This function saves the current state of the logFile buffer to ./data/errorLog.json.
 * @param logType - Type of log "success", "warning", "alert", or "fatal error"
 */
function addInput(logType) {
    try {
        if (logType === LogType.Success || logType === LogType.Warning) {
            writeFileSync(resolve(__dirname, './data/log.json'), JSON.stringify(logFile, null, 2));
        }
        else {
            writeFileSync(resolve(__dirname, './data/errorLog.json'), JSON.stringify(errorLogFile, null, 2));
        }
        reloadLog();
        if (logFile.logging.length > 100 || errorLogFile.logging.length > 100) {
            resetLog(logType);
        }
    }
    catch (err) {
        console.log(err);
    }
}
//#endregion
//#region Function that reset the log file to empty (intended to keep the file from getting too large)
/**
 * This function resets the log file to empty (intended to keep the file from getting too large).
 * @param logType - Type of log "success", "warning", "alert", or "fatal error"
 */
function resetLog(logType) {
    if (logType === LogType.Success || logType === LogType.Warning) {
        if (existsSync(resolve(__dirname, './data/log.json'))) {
            buildLog(logType);
            console.log('Successfully Rebuilt the log.json\n');
            return;
        }
        console.log('Failed Rebuild of the log.json.\n');
    }
    else {
        if (existsSync(resolve(__dirname, './data/errorLog.json'))) {
            buildLog(logType);
            console.log('Successfully Rebuilt the errorLog.json\n');
            return;
        }
        console.log('Failed Rebuild of the errorLog.json.\n');
    }
}
//#endregion
//#region Reloads the log file into internal var
/**
 * This function reloads the log file into internal var.
 */
function reloadLog() {
    if (existsSync(resolve(__dirname, './data/log.json'))) {
        logFile = JSON.parse(readFileSync('./data/log.json', 'utf8'));
    }
    if (existsSync(resolve(__dirname, './data/errorLog.json'))) {
        errorLogFile = JSON.parse(readFileSync(resolve(__dirname, './data/errorLog.json'), 'utf8'));
    }
}
//#endregion
//#region Builds An empty log file with the date and time of build logged at the top
/**
 * This function builds An empty log file with the date and time of build logged at the top.
 * @param logType - Type of log "success", "warning", "alert", or "fatal error"
 */
function buildLog(logType) {
    const logJSON = {
        logging: [new Log(LogType.None, 'Rebuilt Log File')],
    };
    if (logType === LogType.Success || logType === LogType.Warning) {
        writeFileSync(resolve(__dirname, './data/log.json'), JSON.stringify(logJSON, null, 2));
        return;
    }
    writeFileSync(resolve(__dirname, './data/errorLog.json'), JSON.stringify(logJSON, null, 2));
}
//#endregion
export { addToLog };
