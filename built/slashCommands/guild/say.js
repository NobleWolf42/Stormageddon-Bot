//#region Dependencies
import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { errorCustom } from '../../helpers/embedSlashMessages.js';
//#endregion
//#region This exports the say command with the information about it
const saySlashCommand = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Sends message as bot.')
        .addStringOption((option) => option.setName('message').setDescription('Message to send as the bot.').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    execute(client, interaction) {
        //#region Escape Logic
        if (!interaction.isChatInputCommand()) {
            return;
        }
        //#endregion
        const argsString = interaction.options.getString('message');
        if (argsString == '') {
            errorCustom(interaction, 'Cannot send an empty message!', saySlashCommand.data.name, client);
            return;
        }
        interaction.reply(argsString);
    },
};
//#endregion
//#region Exports
export default saySlashCommand;
//#endregion
