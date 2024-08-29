"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToLog = addToLog;
//#region Dependencies
var discord_js_1 = require("discord.js");
var fs_1 = require("fs");
//#endregion
//#region Data Files
var errorLogFile = JSON.parse((0, fs_1.readFileSync)('./data/errorLog.json').toString());
var logFile = JSON.parse((0, fs_1.readFileSync)('./data/log.json').toString());
//#endregion
//#region Helpers
var stringHelpers_js_1 = require("./stringHelpers.js");
//#endregion
//#region Function that adds an item to the log file and sends any fatal errors to the bot developers
/**
 * This function adds an item to the log file and sends any fatal errors to the bot developers.
 * @param {string} logType - Type of log "Success", "Warning", "Alert", or "Fatal Error"
 * @param {string} command String of the command name that was executed
 * @param {string} user - String of the user who executed the command
 * @param {string} server - String of the server name that the command was executed in
 * @param {string} channel - String of the channel name that the command was executed in
 * @param {string} error - String containing error
 * @param {Client} client - Discord.js Client Object
 */
function addToLog(logType, command, user, server, channel, error, client) {
    try {
        reloadLog();
        var d = new Date();
        var i = logFile.logging.length;
        var j = errorLogFile.logging.length;
        var logAdd = {
            Log: '',
            Date: d.toTimeString(),
            Code: logType,
        };
        if (logType.toLowerCase() === 'success' || logType.toLowerCase() === 'warning') {
            logAdd.Log = "".concat(logType, " - Command: ").concat((0, stringHelpers_js_1.capitalize)(command), " Attempted By: ").concat(user, " in \"").concat(server, "\"#").concat(channel);
        }
        else {
            logAdd.Log = "".concat(logType, " - Command: ").concat((0, stringHelpers_js_1.capitalize)(command), " Attempted By: ").concat(user, " in \"").concat(server, "\"#").concat(channel, " --- Error: ").concat(error);
        }
        console.log(logAdd.Log);
        console.log('');
        if (logType.toLowerCase() === 'success' || logType.toLowerCase() === 'warning') {
            logFile.logging[i] = logAdd;
        }
        else {
            errorLogFile.logging[j] = logAdd;
        }
        addInput(logType);
        if (logType.toLowerCase() === 'fatal error' || logType.toLowerCase() === 'alert') {
            var devList = process.env.devIDs.split(',');
            for (var key in devList) {
                var embMsg = new discord_js_1.EmbedBuilder().setDescription("".concat(logAdd.Log)).setTimestamp();
                if (logType.toLowerCase() === 'fatal error') {
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
 */
function addInput(logType) {
    if (logType.toLowerCase() === 'success' || logType.toLowerCase() === 'warning') {
        (0, fs_1.writeFileSync)('./data/log.json', JSON.stringify(logFile, null, 2));
    }
    else {
        (0, fs_1.writeFileSync)('./data/errorLog.json', JSON.stringify(errorLogFile, null, 2));
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
 */
function resetLog(logType) {
    var didDelete = false;
    if (logType.toLowerCase() === 'success' || logType.toLowerCase() === 'warning') {
        if ((0, fs_1.existsSync)('./data/log.json')) {
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
        if ((0, fs_1.existsSync)('./data/errorLog.json')) {
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
    if ((0, fs_1.existsSync)('./data/log.json')) {
        logFile = JSON.parse((0, fs_1.readFileSync)('./data/log.json', 'utf8'));
    }
    if ((0, fs_1.existsSync)('./data/errorLog.json')) {
        errorLogFile = JSON.parse((0, fs_1.readFileSync)('./data/errorLog.json', 'utf8'));
    }
}
//#endregion
//#region Builds An empty log file with the date and time of build logged at the top
/**
 * This function builds An empty log file with the date and time of build logged at the top.
 */
function buildLog(logType) {
    var d = new Date();
    var f = {
        logging: [
            {
                Log: 'Rebuilt Log File',
                Date: d.toTimeString(),
                Code: 'None',
            },
        ],
    };
    if (logType.toLowerCase() === 'success' || logType.toLowerCase() === 'warning') {
        (0, fs_1.writeFileSync)('./data/log.json', JSON.stringify(f, null, 2));
    }
    else {
        (0, fs_1.writeFileSync)('./data/errorLog.json', JSON.stringify(f, null, 2));
    }
}
