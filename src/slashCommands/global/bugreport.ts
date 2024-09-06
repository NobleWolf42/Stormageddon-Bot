//#region Imports
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { embedCustom } from '../../helpers/embedSlashMessages.js';
import { SlashCommand } from '../../models/slashCommandModel.js';
//#endregion

//#region This exports the bugreport command with the information about it
const bugReportSlashCommand: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('bugreport')
        .setDescription('Send a bug report to the developers.')
        .addStringOption((option) => option.setName('bugreport').setDescription('Description of the bug encountered, if you got an error message it was auto-reported.').setRequired(true)),
    async execute(client, interaction) {
        //#region Escape Logic
        if (!interaction.isChatInputCommand()) {
            return;
        }
        //#endregion

        //#region Main Logic - Send a bug report to the bot developers based off user input
        const content = interaction.options.getString('bugreport');

        for (const id of process.env.devIDs.split(',')) {
            const dev = await client.users.fetch(id);
            const embMsg = new EmbedBuilder()
                .setTitle('Bug Report')
                .setColor('#F8AA2A')
                .setDescription(content)
                .setFooter({
                    text: `From - ${interaction.user.username}.`,
                    iconURL: null,
                })
                .setTimestamp();

            await dev.send({ embeds: [embMsg] });
        }

        embedCustom(
            interaction,
            'Bug Report Sent.',
            '#0B6E29',
            `**Bug Report:** \`${content}\` \n**Sent To:** \`🐺 The Developers 🐺\``,
            {
                text: `Requested by ${interaction.user.username}`,
                iconURL: null,
            },
            null,
            [],
            null,
            null
        );
    },
};
//#endregion

//#region Exports
export default bugReportSlashCommand;
//#endregion
