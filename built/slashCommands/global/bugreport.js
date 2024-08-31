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
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
//#endregion
//#region Helpers
const { embedCustom } = require('../../helpers/embedSlashMessages.js');
//#endregion
//#region This exports the bugreport command with the information about it
module.exports = {
    data: new SlashCommandBuilder()
        .setName('bugreport')
        .setDescription('Send a bug report to the developers.')
        .addStringOption((option) => option
        .setName('bugreport')
        .setDescription('Description of the bug encountered, if you got an error message it was auto-reported.')
        .setRequired(true)),
    execute(client, interaction, distube) {
        return __awaiter(this, void 0, void 0, function* () {
            var content = interaction.options.getString('bugreport');
            var devList = process.env.devIDs;
            for (key in devList) {
                var dev = yield client.users.fetch(devList[key]);
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
            return embedCustom(interaction, 'Bug Report Sent.', '#0B6E29', `**Bug Report:** \`${content}\` \n**Sent To:** \`🐺 The Developers 🐺\``, {
                text: `Requested by ${interaction.user.username}`,
                iconURL: null,
            }, null, [], null, null);
        });
    },
};
export {};
//#endregion
