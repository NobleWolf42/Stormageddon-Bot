//#region Dependencies
const { EmbedBuilder, Client } = require('discord.js');
const { readFileSync, writeFileSync, existsSync} = require('fs');
//#endregion

//#region Data Files
const botConfig  = require('../data/botConfig.json');
var logFile = JSON.parse(readFileSync('./data/errorLog.json'));
//#endregion

//#region Helpers
const { capitalize } = require('./stringHelpers.js')
//#endregion

//#region Function that adds an item to the log file and sends any fatal errors to the bot developers
/**
 * This function adds an item to the log file and sends any fatal errors to the bot developers.
 * @param {string} logType - Type of log "Success", "Warning", or "Fatal Error"
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
    
        logAdd = {};
        
        if (logType.toLowerCase() === 'success') {
            logAdd.Log = `${logType} - Command: ${capitalize(command)} Attempted By: ${user} in "${server}"#${channel}`;
        }
        else {
            logAdd.Log = `${logType} - Command: ${capitalize(command)} Attempted By: ${user} in "${server}"#${channel} --- Error: ${error}`;
        }

        console.log(logAdd.Log);
        console.log('');

        logAdd.Date = d;
        logAdd.Code = logType;
        logFile.logging[i] = logAdd;

        if (logType.toLowerCase() === 'fatal error') {
            
            var devList = botConfig.devIDs;
            for(key in devList) {
                const embMsg = new EmbedBuilder()
                    .setTitle('Fatal Errors Detected!')
                    .setColor('#FF0084')
                    .setDescription(`${logAdd.Log}`)
                    .setFooter(logAdd.Date)
                    .attachFiles(['./data/errorLog.json']);
                client.users.cache.get(devList[key]).send(embMsg);
            }
        }

        addInput();
    }
    catch (err) {
        console.log(err);
        console.log('');
    }
}
//#endregion

//#region Function that saves the current state of the logFile buffer to ./data/errorLog.json 
/**
 * This function saves the current state of the logFile buffer to ./data/errorLog.json.
 */
function addInput() {
    writeFileSync('./data/errorLog.json', JSON.stringify(logFile, null, 2), function(err){
        if(err) {
            console.log(err);
            console.log('');
        }
    });
    reloadLog();

    var i = logFile.logging.length
    if (i > 100) {
        resetLog();
    }
}
//#endregion

//#region Function that reset the log file to empty (intended to keep the file from getting too large)
/**
 * This function resets the log file to empty (intended to keep the file from getting too large).
 */
function resetLog() {
    var didDelete = false;

    if(existsSync("./data/errorLog.json")) {
        buildLog();
        didDelete = true;
    }

    if(didDelete === true) { console.log('Successfully Rebuilt the errorLog.json\n');
    } else if(didDelete === false){ console.log('Failed Rebuild of the errorLog.json.\n'); }
}
//#endregion

//#region Reloads the log file into internal var
/**
 * This function reloads the log file into internal var.
 */
function reloadLog() {
    if(existsSync("./data/errorLog.json")) {
        logFile = JSON.parse(readFileSync('./data/errorLog.json', 'utf8'));
    }
}
//#endregion

//#region Builds An empty log file with the date and time of build logged at the top
/**
 * This function builds An empty log file with the date and time of build logged at the top.
 */
function buildLog() {
    var d = new Date();
    var f = { "logging": [{
        "Log": "Rebuilt Log File",
        "Date": d,
        "Code": "None"
    }]};
    writeFileSync('./data/errorLog.json', JSON.stringify(f, null, 2), function(err){
        if(err) {
            console.log(err);
            console.log('');
        }
    });
}
//#endregion

module.exports = { addToLog };