//#region Dependancies
const { readFileSync, writeFileSync, existsSync} = require('fs');
var { MessageEmbed } = require('discord.js');
var logFile = JSON.parse(readFileSync('./data/errorlog.json'));
const botConfig  = require('./data/botconfig.json');
//#endregion

function addToLog(logtype, command, user, userid, channel) {
    try {
        reloadLog();
        var d = new Date();
        var id = userid.toString();
        var i = logFile.logging.length;
        console.log(logtype + ' - Command: ' + command + ' Attempted by ' + user + ' (ID: ' + id + ') in Channel: ' + channel + ' at ' + d.toDateString());
        console.log('');
    
        logadd = {};
        logadd.Log = logtype + ' - Command: ' + command + ' Attempted by ' + user + ' (ID: ' + id + ') in Channel: ' + channel;
        logadd.Date = d;
        logadd.Code = logtype;
        logFile.logging[i] = logadd;
        addInput();
        } catch (err) {
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
        fatalError();
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

function fatalError() {
    console.log(logFile);
    console.log(JSON.parse(readFileSync('./data/errorlog.json', 'utf8')));
    console.log(readFileSync('./data/errorlog.json', 'utf8'));
    var fileCheck;
    var HardError = false;
    var listFatal = '';
    for(let c = 0; c < logFile.logging.length; c++) {
        fileCheck = logFile.logging[c];
        if(fileCheck.Code.toLowerCase() === 'fatal error') {
            listFatal = listFatal + '```Log: ' + fileCheck.Log + '\nDate: ' + fileCheck.Date + '```\n\n';
            HardError = true;
        }
    }

    var devList = botConfig.devids;
    if(HardError === true) {
        for(key in devList) {
            if(listFatal != '') {
                const embMsg = new MessageEmbed()
                    .setTitle('Fatal Errors Detected!')
                    .setColor(0xb50000)
                    .setDescription(listFatal);
                client.users.get(devList[key]).send(embMsg);
            }
        }
    } else {
        HardError = false;
        listFatal = null;
    }
    reloadLog();
    resetLog();
}

module.exports = { addToLog, fatalError };