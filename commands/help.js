var Discord = require('discord.js');
var cmdObj = require('../data/commands.json');
var stringHelper = require('../helpers/stringhelpers.js');

function getHelp(message) {
    var txt = "";
    var sections = Object.keys(cmdObj);
    var title = "Help";
    var userInput = message.content.toLowerCase().split(' ');

    if (userInput.length == 1 || stringHelper.capitalize(userInput[1]) == "Help") {
        txt = "\
        There are **" + sections.length + "** pages of commands. \n \
        The pages are ";

        for(var ind in sections){
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
    
    const embMsg = new Discord.RichEmbed()
        .setTitle((title=="Help"?title:"Help: "+title))
        .setColor(0xb50000)
        .setDescription(txt);
    message.channel.send(embMsg);
    message.delete().catch(O_o=>{});
}

module.exports = { getHelp };