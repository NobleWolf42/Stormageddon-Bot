//#region dependecies
var Discord = require('discord.js');
var cmdObj = require('../data/commands.json');
var stringHelper = require('../helpers/stringhelpers.js');
//#endregion

var excludedcommands = ["Admin"];

//#region info command
function getInfo(message) {
    var txt = '**Bot Name:** Stormageddon Bot\n\n**Description:** All purpose bot, named after the worlds best Doggo, **MagmaHusky\'s** Stormageddon.\n\n**Designed and Bulit by:** *NobleWolf42, Captain Zendik, and CzRSpecV*\n\n**How To Help:** If you would like to assist with the bot, you can find us on Discord at https://discord.gg/tgJtK7f, and on GitHub at https://github.com/NobleWolf42/Stormageddon-Bot/.';

    const embMsg = new Discord.RichEmbed()
        .setTitle('Information')
        .setColor(34449)
        .setDescription(txt);
    message.author.send(embMsg);
    message.delete().catch(O_o=>{});
}
//#endregion

//#region Help function
function getHelp(adminbool, message, serverAdmin) {
    var txt = "";
    var sections = Object.keys(cmdObj);
    var title = "Help";
    var userInput = message.content.toLowerCase().split(' ');

    if (userInput.length == 1 || stringHelper.capitalize(userInput[1]) == "Help") {
        txt = "\
        There are **" + getHelpSize(adminbool, sections) + "** pages of commands. \n \
        The pages are ";

        for(var ind in sections){
            if (!adminbool && sections[ind] =="Admin") { continue; }
            if (!serverAdmin && sections[ind] == "Server Admin") { continue; }
            txt += ("`" + sections[ind] + "`");
            if (ind < sections.length-1){
                txt +=", ";
            }
        }

        txt += ". \n \n **Commands**: \n";
        for (key in cmdObj["Help"]) {
            txt += key + ' - ' + cmdObj["Help"][key] + '\n';
        }
    }
    else {
        title = stringHelper.capitalize(userInput[1]);
        if (sections.includes(title)) {
            for (key in cmdObj[title]) {
                txt += key + ' - ' + cmdObj[title][key] + '\n';
            }
        }
    }
    
    if (!adminbool && title =="Admin") { 
        title="Access Denied";
        txt="You do not have access to those commands.";
    }
    else {
        title = (title=="Help"?title:"Help: "+title);
    }

    const embMsg = new Discord.RichEmbed()
        .setTitle(title)
        .setColor(0xb50000)
        .setDescription(txt);
    message.author.send(embMsg);
    message.delete().catch(O_o=>{});
}
//#endregion

//#region Help function helpers
function getHelpSize(adminbool, sections){
    var size = sections.length;
    // if the user isn't an admin
    if (!adminbool){
        for(var index in excludedcommands){
            if (sections.includes(excludedcommands[index])){
                size--;
            }
        }
    }

    return size;
}
//#endregion

//#region exports
module.exports = { getHelp, getInfo };
//#endregion