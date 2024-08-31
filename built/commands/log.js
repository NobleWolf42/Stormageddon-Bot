//#region Dependencies
const { EmbedBuilder } = require('discord.js');
//#endregion
//#region Helpers
const { errorCustom } = require('../helpers/embedMessages.js');
const { addToLog } = require('../helpers/errorLog.js');
//#endregion
//#region This exports the log command with the information about it
module.exports = {
    name: 'logs',
    type: ['DM'],
    aliases: [''],
    coolDown: 0,
    class: 'developer',
    usage: 'logs',
    description: 'Triggers the bot to send you the log files.',
    execute(message, args, client, distube) {
        if (process.env.devIDs.includes(message.author.id)) {
            const embMsg = new EmbedBuilder()
                .setDescription(`Log files attached.`)
                .setTimestamp()
                .setTitle('Logs')
                .setColor('#5D3FD3');
            client.users.send(message.author.id, {
                embeds: [embMsg],
                files: [
                    {
                        attachment: './data/errorLog.json',
                        name: 'errorLog.json',
                    },
                    {
                        attachment: './data/log.json',
                        name: 'log.json',
                    },
                ],
            });
        }
        else {
            addToLog('Alert', module.name, message.author.tag, 'Direct Message', 'Direct Message', 'Attempted to use dev only command!', client);
            return errorCustom(message, 'You do not have permission to use this command!', module.name, client);
        }
    },
};
//#endregion
