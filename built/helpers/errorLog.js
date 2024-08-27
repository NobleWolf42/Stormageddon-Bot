//#region Dependencies
var _a = require('discord.js'), EmbedBuilder = _a.EmbedBuilder, Client = _a.Client;
var _b = require('fs'), readFileSync = _b.readFileSync, writeFileSync = _b.writeFileSync, existsSync = _b.existsSync;
//#endregion
//#region Data Files
var errorLogFile = JSON.parse(readFileSync('./data/errorLog.json'));
var logFile = JSON.parse(readFileSync('./data/log.json'));
//#endregion
//#region Helpers
var capitalize = require('./stringHelpers.js').capitalize;
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
        logAdd = {};
        if (logType.toLowerCase() === 'success' ||
            logType.toLowerCase() === 'warning') {
            logAdd.Log = "".concat(logType, " - Command: ").concat(capitalize(command), " Attempted By: ").concat(user, " in \"").concat(server, "\"#").concat(channel);
        }
        else {
            logAdd.Log = "".concat(logType, " - Command: ").concat(capitalize(command), " Attempted By: ").concat(user, " in \"").concat(server, "\"#").concat(channel, " --- Error: ").concat(error);
        }
        console.log(logAdd.Log);
        console.log('');
        logAdd.Date = d.toTimeString();
        logAdd.Code = logType;
        if (logType.toLowerCase() === 'success' ||
            logType.toLowerCase() === 'warning') {
            logFile.logging[i] = logAdd;
        }
        else {
            errorLogFile.logging[j] = logAdd;
        }
        addInput(logType);
        if (logType.toLowerCase() === 'fatal error' ||
            logType.toLowerCase() === 'alert') {
            var devList = process.env.devIDs;
            for (key in devList) {
                var embMsg = new EmbedBuilder()
                    .setDescription("".concat(logAdd.Log))
                    .setTimestamp();
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
    if (logType.toLowerCase() === 'success' ||
        logType.toLowerCase() === 'warning') {
        writeFileSync('./data/log.json', JSON.stringify(logFile, null, 2), function (err) {
            if (err) {
                console.log(err);
                console.log('');
            }
        });
    }
    else {
        writeFileSync('./data/errorLog.json', JSON.stringify(errorLogFile, null, 2), function (err) {
            if (err) {
                console.log(err);
                console.log('');
            }
        });
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
    if (logType.toLowerCase() === 'success' ||
        logType.toLowerCase() === 'warning') {
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
    if (logType.toLowerCase() === 'success' ||
        logType.toLowerCase() === 'warning') {
        writeFileSync('./data/log.json', JSON.stringify(f, null, 2), function (err) {
            if (err) {
                console.log(err);
                console.log('');
            }
        });
    }
    else {
        writeFileSync('./data/errorLog.json', JSON.stringify(f, null, 2), function (err) {
            if (err) {
                console.log(err);
                console.log('');
            }
        });
    }
}
//#endregion
module.exports = { addToLog: addToLog };
