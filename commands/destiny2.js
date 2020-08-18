//#region 
const { XMLHttpRequest } = require("xmlhttprequest");
const config = require('../data/botconfig.json');
const { embedCustom, warnCustom, errorCustom } = require('../helpers/embedMessages.js');
//#endregion

//#region ISS Command
module.exports = {
    name: "destiny2",
    type: ['DM', 'Gulid'],
    aliases: ['d2'],
    cooldown: 0,
    class: 'gaming',
    usage: 'destiny2 status ***INSERT-BUNGIE-NAME*** or destiny2 clan ***INSERT-CLAN-NAME***',
    description: "Status displays the Destiny 2 account's original creation date and last API update date. Clan displays Destiny 2 clan's bio, avatar, motto, and founder.",
    execute(message, args) {
        if (args[0] == 'status') {
            getStatus(message, args[1]);
        }
        else if (args[0] == 'clan') {
            var clanName = '';
            
            for (i = 1; i < args.length; i++) {
                if (i != (args.length - 1)) {
                    clanName += `${args[i]} `;
                }
                else {
                    clanName += `${args[i]}`;
                }
            }
            getClan(message, clanName);
        }

    }
}

function getStatus(message, pers_name) {
    // Request initialized and created
    var request = new XMLHttpRequest()
    request.open('GET', 'https://www.bungie.net/Platform//User/SearchUsers?q='+pers_name, true);
    request.setRequestHeader('X-API-KEY', config.auth.d2ApiKey);
    request.onload = function() {
        //After request is recieved, parse it.
        var data = JSON.parse(request.responseText)["Response"][0];

        if (request.status >= 200 && request.status < 400 ) {
            if (data != null) {
                embedCustom(message, 'User Information', '#F5F5F5', `User was last updated at ${data["lastUpdate"]}\n User began their journey at ${data["firstAccess"]}.`);
            }
            else {
                warnCustom(message, `The Search for \`${pers_name}\` returned no results.\n Try something else.`);
            }
        } else {
            errorCustom(message, `The Destiny API was unable to be reached at this time.\n Try again later.`);
            }
    }
    request.send()
}

function getClan(message, clan_name){
    // Request initialized and created
    var request = new XMLHttpRequest()
    request.open('GET', 'https://www.bungie.net/Platform/GroupV2/Name/'+clan_name+'/1', true);
    request.setRequestHeader('X-API-KEY', config.auth.d2ApiKey);
    request.onload = function() {
        // After request is recieved, parse it.
        var data = JSON.parse(request.responseText)["Response"];
        var error = JSON.parse(request.responseText);

        if (request.status >= 200 && request.status < 400) {
            if (data != null && data != undefined) {
                var domain = "https://www.bungie.net/";

                var attachment = (domain + data["detail"]["avatarPath"]);
                embedCustom(message, `${clan_name} Clan Information`, '#F5F5F5', `The clan was created on ${data["detail"]["creationDate"]}.\n The founder is ${data["founder"]["bungieNetUserInfo"]["displayName"]}.\n\n ${data["detail"]["about"]}`, attachment);
            }
            else {
                warnCustom(message, `The Search for \`${clan_name}\` returned no results.\n Try something else.`);
            }
        }
        else if (error.ErrorStatus == 'ClanNotFound') {
            warnCustom(message, `The Search for \`${clan_name}\` returned no results.\n Try something else.`);
        }
        else {
            errorCustom(message, "The Destiny API was unable to be reached at this time.\n Try again later.");
        }
    }

    request.send()
}