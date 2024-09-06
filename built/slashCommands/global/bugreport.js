var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//#region Imports
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { embedCustom } from '../../helpers/embedSlashMessages.js';
//#endregion
//#region This exports the bugreport command with the information about it
const bugReportSlashCommand = {
    data: new SlashCommandBuilder()
        .setName('bugreport')
        .setDescription('Send a bug report to the developers.')
        .addStringOption((option) => option.setName('bugreport').setDescription('Description of the bug encountered, if you got an error message it was auto-reported.').setRequired(true)),
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            //#region Escape Logic
            if (!interaction.isChatInputCommand()) {
                return;
            }
            //#endregion
            //#region Main Logic - Send a bug report to the bot developers based off user input
            const content = interaction.options.getString('bugreport');
            for (const id of process.env.devIDs.split(',')) {
                const dev = yield client.users.fetch(id);
                const embMsg = new EmbedBuilder()
                    .setTitle('Bug Report')
                    .setColor('#F8AA2A')
                    .setDescription(content)
                    .setFooter({
                    text: `From - ${interaction.user.username}.`,
                    iconURL: null,
                })
                    .setTimestamp();
                yield dev.send({ embeds: [embMsg] });
            }
            embedCustom(interaction, 'Bug Report Sent.', '#0B6E29', `**Bug Report:** \`${content}\` \n**Sent To:** \`🐺 The Developers 🐺\``, {
                text: `Requested by ${interaction.user.username}`,
                iconURL: null,
            }, null, [], null, null);
        });
    },
};
//#endregion
//#region Exports
export default bugReportSlashCommand;
//#endregion
