//#region Helpers
const { embedCustom } = require('../helpers/embedMessages.js');
//#endregion

//#region This exports the info command with the information about it
module.exports = {
    name: "info",
    type: ['DM', 'Guild'],
    aliases: [],
    coolDown: 60,
    class: 'help',
    usage: 'info',
    description: "Displays information about the bot, it's creators, and where you can go if you would like to contribute to it.",
    async execute(message, args, client) {
        return embedCustom(message, 'Information', '#200132', `**Bot Name:** ${client.user}\n\n**Description:** All purpose bot, named after the worlds best Doggo, **${await(client.users.fetch('211865015592943616'))}'s** Stormageddon.\n\n**Designed and Built by:** *${await(client.users.fetch('201665936049176576'))}, ${await(client.users.fetch('134900859560656896'))}, and ${await(client.users.fetch('199716053729804288'))}*\n\n**How To Help:** If you would like to assist with the bot, you can find us on [\`Discord\`](https://discord.gg/tgJtK7f) , and on [\`GitHub\`](https://github.com/NobleWolf42/Stormageddon-Bot/).`, { text: `Requested by ${message.author.tag}`, iconURL: null }, null, [], null, null);
    }
}
//#endregion
