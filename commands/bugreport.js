//#region Data Files
const botConfig = require('../data/botConfig.json');
//#endregion

//#region Helpers
const { embedCustom } = require('../helpers/embedMessages.js');
//#endregion


//#region This exports the bugreport command with the information about it
module.exports = {
    name: "bugreport",
    type: ['DM'],
    aliases: [],
    coolDown: 60,
    class: 'direct',
    usage: '!bugreport ***MESSAGE***',
    description: "Whisper via Stormageddon to report a bug to the developers of Stormageddon.",
    execute(message, args, client) {
        var argsString = args.join(' ');
        var arguments = argsString.split(', ');
        var content = arguments[0];
        
        var devList = botConfig.devIDs;
        
        for (key in devList) {
            embedCustom(message, "Bug Report", "#F8AA2A", content, { text: `From - ${message.author.tag}.`, iconURL: null }, null, [], null, null);
        }
        
        embedCustom(message, 'Bug Report Sent.', '#0B6E29', `**Bug Report:** \`${content}\` \n**Sent To:** \`🐺 The Developers 🐺\``, { text: null, iconURL: null }, null, [], null, null);
    }
}
//#endregion
