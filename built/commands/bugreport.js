var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//#region Import
import { EmbedBuilder } from 'discord.js';
import { embedCustom } from '../helpers/embedMessages.js';
//#endregion
//#region This creates the bugreport command with the information about it
const bugReportCommand = {
    name: 'bugreport',
    type: ['DM'],
    aliases: [],
    coolDown: 60,
    class: 'direct',
    usage: '!bugreport ***MESSAGE***',
    description: 'Whisper via Stormageddon to report a bug to the developers of Stormageddon. (Only works in Direct Message.)',
    execute(message, args, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const newArgs = args.join(' ');
            const devList = process.env.devIDs.split(',');
            for (const key of devList) {
                const dev = yield client.users.fetch(key);
                const embMsg = new EmbedBuilder()
                    .setTitle('Bug Report')
                    .setColor('#F8AA2A')
                    .setDescription(newArgs)
                    .setFooter({
                    text: `From - ${message.author.tag}.`,
                    iconURL: null,
                })
                    .setTimestamp();
                yield dev.send({ embeds: [embMsg] });
            }
            embedCustom(message, 'Bug Report Sent.', '#0B6E29', `**Bug Report:** \`${newArgs}\` \n**Sent To:** \`🐺 The Developers 🐺\``, { text: `Requested by ${message.author.tag}`, iconURL: null });
        });
    },
};
//#endregion
//#region Exports
export default bugReportCommand;
//#endregion
