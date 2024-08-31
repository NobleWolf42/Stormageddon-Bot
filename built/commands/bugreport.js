var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//#region Dependencies
const { EmbedBuilder } = require('discord.js');
//#endregion
//#region Helpers
const { embedCustom } = require('../helpers/embedMessages.js');
//#endregion
//#region This exports the bugreport command with the information about it
module.exports = {
    name: 'bugreport',
    type: ['DM'],
    aliases: [],
    coolDown: 60,
    class: 'direct',
    usage: '!bugreport ***MESSAGE***',
    description: 'Whisper via Stormageddon to report a bug to the developers of Stormageddon. (Only works in Direct Message.)',
    execute(message, args, client, distube) {
        return __awaiter(this, void 0, void 0, function* () {
            var argsString = args.join(' ');
            var arguments = argsString.split(', ');
            var content = arguments[0];
            var devList = process.env.devIDs;
            for (key in devList) {
                var dev = yield client.users.fetch(devList[key]);
                const embMsg = new EmbedBuilder()
                    .setTitle('Bug Report')
                    .setColor('#F8AA2A')
                    .setDescription(content)
                    .setFooter({
                    text: `From - ${message.author.tag}.`,
                    iconURL: null,
                })
                    .setTimestamp();
                yield dev.send({ embeds: [embMsg] });
            }
            return embedCustom(message, 'Bug Report Sent.', '#0B6E29', `**Bug Report:** \`${content}\` \n**Sent To:** \`🐺 The Developers 🐺\``, { text: `Requested by ${message.author.tag}`, iconURL: null }, null, [], null, null);
        });
    },
};
export {};
//#endregion
