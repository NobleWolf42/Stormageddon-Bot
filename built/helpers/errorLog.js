//#region Imports
import { EmbedBuilder } from 'discord.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { capitalize } from './stringHelpers.js';
import { Log, LogType } from '../models/loggingModel.js';
//#endregion
//#region Error Logs
var errorLogFile = JSON.parse(readFileSync('./data/errorLog.json').toString());
var logFile = JSON.parse(readFileSync('./data/log.json').toString());
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
        var d = new Date();
        var i = logFile.logging.length;
        var j = errorLogFile.logging.length;
        var logAdd = new Log(logType);
        if (logType === LogType.Success || logType === LogType.Warning) {
            logAdd.Log = `${capitalize(logType)} - Command: ${capitalize(command)} Attempted By: ${user} in "${server}"#${channel}`;
        }
        else {
            logAdd.Log = `${capitalize(logType)} - Command: ${capitalize(command)} Attempted By: ${user} in "${server}"#${channel} --- Error: ${error}`;
        }
        console.log(logAdd.Log);
        console.log('');
        if (logType === LogType.Success || logType === LogType.Warning) {
            logFile.logging[i] = logAdd;
        }
        else {
            errorLogFile.logging[j] = logAdd;
        }
        addInput(logType);
        if (logType === LogType.FatalError || logType === LogType.Alert) {
            var devList = process.env.devIDs.split(',');
            for (var key in devList) {
                const embMsg = new EmbedBuilder().setDescription(`${logAdd.Log}`).setTimestamp();
                if (logType === LogType.FatalError) {
                    embMsg.setTitle('Fatal Errors Detected!');
                    embMsg.setColor('#FF0084');
                }
                else {
                    embMsg.setTitle('Alert!');
                    embMsg.setColor('#A06700');
                }
                client.users.send(devList[key], {
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
    if (logType === LogType.Success || logType === LogType.Warning) {
        writeFileSync('./data/log.json', JSON.stringify(logFile, null, 2));
    }
    else {
        writeFileSync('./data/errorLog.json', JSON.stringify(errorLogFile, null, 2));
    }
    reloadLog();
    var i = logFile.logging.length;
    var j = errorLogFile.logging.length;
    if (i > 100 || j > 100) {
        resetLog(logType);
    }
}
//#endregion
//#region Function that reset the log file to empty (intended to keep the file from getting too large)
/**
 * This function resets the log file to empty (intended to keep the file from getting too large).
 * @param logType - Type of log "success", "warning", "alert", or "fatal error"
 */
function resetLog(logType) {
    var didDelete = false;
    if (logType === LogType.Success || logType === LogType.Warning) {
        if (existsSync('./data/log.json')) {
            buildLog(logType);
            didDelete = true;
        }
        if (didDelete === true) {
            console.log('Successfully Rebuilt the log.json\n');
        }
        else {
            console.log('Failed Rebuild of the log.json.\n');
        }
    }
    else {
        if (existsSync('./data/errorLog.json')) {
            buildLog(logType);
            didDelete = true;
        }
        if (didDelete === true) {
            console.log('Successfully Rebuilt the errorLog.json\n');
        }
        else {
            console.log('Failed Rebuild of the errorLog.json.\n');
        }
    }
}
//#endregion
//#region Reloads the log file into internal var
/**
 * This function reloads the log file into internal var.
 */
function reloadLog() {
    if (existsSync('./data/log.json')) {
        logFile = JSON.parse(readFileSync('./data/log.json', 'utf8'));
    }
    if (existsSync('./data/errorLog.json')) {
        errorLogFile = JSON.parse(readFileSync('./data/errorLog.json', 'utf8'));
    }
}
//#endregion
//#region Builds An empty log file with the date and time of build logged at the top
/**
 * This function builds An empty log file with the date and time of build logged at the top.
 * @param logType - Type of log "success", "warning", "alert", or "fatal error"
 */
function buildLog(logType) {
    var d = new Date();
    var f = {
        logging: [new Log(LogType.None, 'Rebuilt Log File')],
    };
    if (logType === LogType.Success || logType === LogType.Warning) {
        writeFileSync('./data/log.json', JSON.stringify(f, null, 2));
    }
    else {
        writeFileSync('./data/errorLog.json', JSON.stringify(f, null, 2));
    }
}
//#endregion
export { addToLog };
