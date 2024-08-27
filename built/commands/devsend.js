//#regions Dependencies
var EmbedBuilder = require('discord.js').EmbedBuilder;
var _a = require('../helpers/embedMessages.js'), errorCustom = _a.errorCustom, embedCustom = _a.embedCustom;
//#endregion
//#region Helpers
var addToLog = require('../helpers/errorLog.js').addToLog;
//#endregion
//#region This exports the devsend command with the information about it
module.exports = {
    name: 'devsend',
    type: ['DM'],
    aliases: [],
    coolDown: 0,
    class: 'developer',
    usage: '!devsend ***USER-ID***, ***MESSAGE***',
    description: 'Developer-only command for sending messages as the bot. (Only works in Direct Message.)',
    execute: function (message, args, client, distube) {
        var argsString = args.join(' ');
        var arguments = argsString.split(', ');
        var user = arguments[0];
        var content = arguments[1];
        if (process.env.devIDs.includes(message.author.id)) {
            var embMsg = new EmbedBuilder()
                .setTitle('Message from Developers')
                .setColor('#0B6E29')
                .setDescription(content)
                .setFooter({
                text: 'NOTE: You cannot respond to this message.',
                iconURL: null,
            })
                .setTimestamp();
            client.users.send(user, { embeds: [embMsg] });
            return embedCustom(message, 'Message Sent.', '#0B6E29', "**Message:** `".concat(content, "` \n**Sent To:** `").concat(client.users.cache.get(user).tag, "`"), { text: "Requested by ".concat(message.author.tag), iconURL: null }, null, [], null, null);
        }
        else {
            addToLog('Alert', module.name, message.author.tag, 'Direct Message', 'Direct Message', 'Attempted to use dev only command!', client);
            return errorCustom(message, 'You do not have permission to use this command!', module.name, client);
        }
    },
};
//#endregion
