var Discord = require('discord.js');
var xmlhttp = require("xmlhttprequest");

var XMLHttpRequest = xmlhttp.XMLHttpRequest;

function getStatus(message, pers_name) {
    // Request initialized and created
    var request = new XMLHttpRequest()
    request.open('GET', 'https://www.bungie.net/Platform//User/SearchUsers?q='+pers_name, true);
    request.setRequestHeader('X-API-KEY', '671b3211756445cbb83b5d82f6682ebd');
    request.onload = function() {
        // After request is recieved, parse it.
        var data = JSON.parse(request.responseText)["Response"][0]

        if (request.status >= 200 && request.status < 400 ) {
            if (data != null) {
                message.reply("\n User was last updated at " + data["lastUpdate"] + "\n User began their journey at " + data["firstAccess"]);
            }
            else {
                message.reply("\n The Search for a user by that name returned no results. \n Try something else.");
            }
        } else {
            message.reply("The Destiny API was unable to be reached at this time. \n Try again later.");
            }
    }
    request.send()
}

function getClan(message, clan_name){
    // Request initialized and created
    var request = new XMLHttpRequest()
    request.open('GET', 'https://www.bungie.net/Platform/GroupV2/Name/'+clan_name+'/1', true);
    request.setRequestHeader('X-API-KEY', '671b3211756445cbb83b5d82f6682ebd');
    request.onload = function() {
        // After request is recieved, parse it.
        var data = JSON.parse(request.responseText)["Response"]

        if (request.status >= 200 && request.status < 400) {
            if (data != null) {
                var domain = "https://www.bungie.net/";
                // Clan Avatar + about section
                var attachment = new Discord.Attachment(domain + data["detail"]["avatarPath"]);
                message.channel.send(data["detail"]["about"], attachment);
                //Founder Profile pic + name
                var attachment = new Discord.Attachment(domain + data["founder"]["bungieNetUserInfo"]["iconPath"]);
                message.channel.send("The founder is " + data["founder"]["bungieNetUserInfo"]["displayName"],attachment);
                // Clan Creation Date
                message.reply("The clan was created on " + data["detail"]["creationDate"]);
            }
            else {
                message.reply("\n The Search for a clan by that name returned no results. \n Try something else.");
            }
        } else {
            message.reply("The Destiny API was unable to be reached at this time. \n Try again later.");
        }
    }

    request.send()
}

module.exports = { getStatus, getClan };