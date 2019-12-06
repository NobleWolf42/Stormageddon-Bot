//#region dependecies
var Discord = require('discord.js');
var cmdObj = require('../data/commands.json');
var stringHelper = require('../helpers/stringhelpers.js');
//#endregion

var excludedcommands = ["Admin"];

//#region Help function
function getHelp(adminbool, message) {
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
            if (!message.member.hasPermission('ADMINISTRATOR') && sections[ind] == "Server Admin") { continue; }
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

module.exports = { getHelp };