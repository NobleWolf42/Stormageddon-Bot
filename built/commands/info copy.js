var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//#region Helpers
const { embedCustom } = require('../helpers/embedMessages.js');
//#endregion
//#region This exports the info command with the information about it
module.exports = {
    name: 'info',
    type: ['DM', 'Guild'],
    aliases: [],
    coolDown: 60,
    class: 'help',
    usage: 'info',
    description: "Displays information about the bot, it's creators, and where you can go if you would like to contribute to it. (Works in Direct Messages too.)",
    execute(message, args, client, distube) {
        return __awaiter(this, void 0, void 0, function* () {
            return embedCustom(message, 'Information', '#200132', `**Bot Name:** ${client.user}\n\n**Description:** All purpose bot, named after the worlds best Doggo, **${yield client.users.fetch('211865015592943616')}'s** Stormageddon.\n\n**Designed and Built by:** *${yield client.users.fetch('201665936049176576')}, ${yield client.users.fetch('134900859560656896')}, ${yield client.users.fetch('199716053729804288')}, and ${yield client.users.fetch('207305619168952320')}*\n\n**How To Help:** If you would like to assist with the bot, you can find us on [\`Discord\`](https://discord.gg/tgJtK7f) , and on [\`GitHub\`](https://github.com/NobleWolf42/Stormageddon-Bot/).`, { text: `Requested by ${message.author.tag}`, iconURL: null }, null, [], null, null);
        });
    },
};
export {};
//#endregion
