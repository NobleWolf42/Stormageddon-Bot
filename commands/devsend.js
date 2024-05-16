//#regions Dependencies
const { errorCustom, embedCustom } = require('../helpers/embedMessages.js');
//#endregion

//#region Data Files
const botConfig = require('../data/botconfig.json');
//#endregion

//#region This exports the devsend command with the information about it
module.exports = {
    name: "devsend",
    type: ['DM'],
    aliases: [],
    cooldown: 0,
    class: 'direct',
    usage: '!devsend ***USER-ID***, ***MESSAGE***',
    description: "Developer-only command for sending messages as the bot.",
    execute(message, args, client) {
        var argsString = args.join(' ');
        var arguments = argsString.split(', ');
        var user = arguments[0];
        var content = arguments[1];

        if (botConfig.devids.includes(message.author.id)) {
            client.users.cache.get(user).send(content + 'NOTE: You cannot respond to this message.`');

            embedCustom(message, 'Message Sent.', '#0B6E29', `**Message:** \`${content}\` \n**Sent To:** \`${client.users.cache.get(user).tag}\``);
        }
        else {
            errorCustom(message, 'You do not have permission to use this command!', module.name);
        }
    }
}
//#endregion
