//#regions dependancies
var fs = require('fs');

var sconfig = JSON.parse(fs.readFileSync('./data/serverconfig.json', 'utf8'));
var bconfig = require('../data/botconfig.json');

var errormsg = require('../helpers/errormessages.js');
//#endregion

//#region modMailSend
function modMailSend (client, message, servername, content) {
    var serverid = 0;

    //console.log(client.guilds);
    client.guilds.forEach(function (key) {
        if (key.name == servername) {
            serverid = key.id;
        }
    })

    if ((serverid != 0) && (sconfig[serverid] != undefined)) {
        if (sconfig[serverid].modmail.enable) {
            var modlist = sconfig[serverid].modmail.modlist;

            for (key in modlist) {
                client.users.get(modlist[key]).send(content + '\n From - ' + message.author.tag + ' in Server - ' + servername);
            }
        }
        else {
            errormsg.disabled(message, 'modmail');
        }
    }
    else if (sconfig[serverid] == undefined) {
        errormsg.custom(message, `The !setup command has not been run on ${servername} yet.`);
    }
    else {
        errormsg.custom(message, 'The server you specified does not exist, or you failed to specify a server.');
    }
}
//#endregion

//#region devSend
function devSend(client, message, user, content) {
    client.users.get(user).send('```' + content + '````NOTE: You cannot respond to this message.`');

    message.channel.send('```Message Sent.```');
}
//#endregion

//#region bugReport
function bugReport(client, message, content) {
    var devlist = bconfig.devids;

    for (key in devlist) {
        client.users.get(devlist[key]).send('```***BUG REPORT***``` ```\n' + content + '\n ````From - ' + message.author.tag + '`');
    }

    message.channel.send('```Bug Report Recieved.```');
}
//#endregion

//#region export
module.exports = { modMailSend, devSend, bugReport };
//#endregion