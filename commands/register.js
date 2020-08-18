//#region Dependancies
const { refreshUser } = require('../helpers/userHandling.js');
const { embedCustomDM } = require('../helpers/embedMessages.js');
const botConfig = require('../data/botconfig.json');
//#endregion

module.exports = {
    name: "register",
    type: ['DM', 'Gulid'],
    aliases: [],
    cooldown: 60,
    class: 'help',
    usage: 'register',
    description: "Lets you know if you are registered and gives you the link to register/update you info.",
    execute(message) {
        refreshUser();
        if (message.author.id in userAccountInfo) {
            var txt = `You Have Already Registered.\nThe last time you updated your info was ${userAccountInfo[message.author.id].time}\n If you wish to update you info now, please click on this link: ${botConfig.general.registerLink}`;
            var color = '#24661A';
        }
        else {
            var txt = `Click on this link to register: ${botConfig.general.registerLink}`;
            var color = '#FF0000';
        }

        embedCustomDM(message, 'Register', color, txt);
        return;
    }
};