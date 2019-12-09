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

    if ((serverid != 0) || (sconfig[serverid].modmail.enable)) {
        var modlist = sconfig[serverid].modmail.modlist;

        for (key in modlist) {
            client.users.get(modlist[key]).send(content + '\n From - ' + message.author.tag + ' in Server - ' + servername);
        }
    }
    else if (!sconfig[serverid].modmail.enable) {
        errormsg.disabled(message, 'modmail')
    }
    else {
        errormsg.custom(message, 'The server you specified does not exist, or you failed to specify a server.');
    }
}
//#endregion

//#region devSend
function devSend(client, user, content) {
    client.users.get(user).send(content + '\n NOTE: You cannot reposnd to this message.');
}
//#endregion

//#region bugReport
function bugReport(client, message, content) {
    var devlist = bconfig.devids;

    for (key in devlist) {
        client.users.get(devlist[key]).send('```***BUG REPORT***```\n' + content + '\n From - ' + message.author.tag);
    }
}
//#endregion

//#region export
module.exports = { modMailSend, devSend, bugReport };
//#endregion