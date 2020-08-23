//#region Dependancies
const { readFileSync, writeFileSync, existsSync} = require('fs');
const { MessageEmbed } = require('discord.js');
const { capitalize } = require('../helpers/stringhelpers.js')
var logFile = JSON.parse(readFileSync('./data/errorlog.json'));
const botConfig  = require('../data/botconfig.json');
//#endregion

function addToLog(logtype, command, user, server, channel, client, error) {
    try {
        reloadLog();
        var d = new Date();
        var i = logFile.logging.length;
        console.log(`${logtype} - Command: ${capitalize(command)} Attempted By: ${user} in ${server}'s #${channel} channel at ${d.toDateString()}`);
        console.log('');
    
        logadd = {};
        logadd.Log = `${logtype} - Command: ${capitalize(command)} Attempted By: ${user} in "${server}"#${channel}`;
        logadd.Date = d;
        logadd.Code = logtype;
        logFile.logging[i] = logadd;

        if (logtype.toLowerCase() === 'fatal error') {
            
            var devList = botConfig.devids;
            for(key in devList) {
                const embMsg = new MessageEmbed()
                    .setTitle('Fatal Errors Detected!')
                    .setColor('#FF0084')
                    .setDescription(`${logadd.Log} \n Console Error: ${error}`)
                    .setFooter(logadd.Date)
                    .attachFiles(['./data/errorlog.json']);
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

function addInput() {
    writeFileSync('./data/errorlog.json', JSON.stringify(logFile, null, 2), function(err){
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

function resetLog() {
    var diddelete = false;

    if(existsSync("./data/errorlog.json")) {
        buildLog();
        diddelete = true;
    }

    if(diddelete === true) { console.log('Successfuly Rebuilt the errorlog.json\n');
    } else if(diddelete === false){ console.log('Failed Rebuild of the errorlog.json.\n'); }
}

function reloadLog() {
    if(existsSync("./data/errorlog.json")) {
        logFile = JSON.parse(readFileSync('./data/errorlog.json', 'utf8'));
    }
}

function buildLog() {
    var d = new Date();
    var f = { "logging": [{
        "Log": "Rebuilt Log File",
        "Date": d,
        "Code": "None"
    }]};
    writeFileSync('./data/errorlog.json', JSON.stringify(f, null, 2), function(err){
        if(err) {
            console.log(err);
            console.log('');
        }
    });
}

module.exports = { addToLog };