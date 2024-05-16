//#regions Dependencies
const { MessageEmbed } = require('discord.js');
//#endregion

//#region Data Files
const botConfig = require('../data/botconfig.json');
//#endregion

//#region Helpers
const { embedCustom } = require('../helpers/embedMessages.js');
//#endregion


//#region This exports the bugreport command with the information about it
module.exports = {
    name: "bugreport",
    type: ['DM'],
    aliases: [],
    cooldown: 60,
    class: 'direct',
    usage: '!bugreport ***MESSAGE***',
    description: "Whisper via Stormageddon to report a bug to the developers of Stormageddon.",
    execute(message, args, client) {
        var argsString = args.join(' ');
        var arguments = argsString.split(', ');
        var content = arguments[0];
        
        var devlist = botConfig.devids;
        
        const embMsg = new MessageEmbed()
            .setTitle('Bug Report')
            .setColor('#F8AA2A')
            .setFooter(`From - ${message.author.tag}.`)
            .setDescription(content)

        for (key in devlist) {
            client.users.cache.get(devlist[key]).send(embMsg);
        }
        
        embedCustom(message, 'Bug Report Sent.', '#0B6E29', `**Bug Report:** \`${content}\` \n**Sent To:** \`🐺 The Developers 🐺\``);
    }
}
//#endregion
