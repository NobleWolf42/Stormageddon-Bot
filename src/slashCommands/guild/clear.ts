//#region Imports
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { errorCustom, embedCustom, warnCustom } from '../../helpers/embedSlashMessages.js';
import { SlashCommand } from '../../models/slashCommandModel.js';
//#endregion

//#region This exports the clear command with the information about it
const clearSlashCommand: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Bulk deletes the previous messages in a chat, up to 99 previous messages.')
        .addNumberOption((option) => option.setName('amount').setDescription('The number of messages to delete (1-100).').setRequired(true).setMinValue(1).setMaxValue(100))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(client, interaction) {
        //#region Escape Logic
        if (!interaction.isChatInputCommand()) {
            return;
        }

        const amount = Number(interaction.options.getInteger('amount'));

        if (isNaN(amount)) {
            warnCustom(interaction, `That is not a valid number for the clear command!`, clearSlashCommand.data.name);
            return;
        }

        if (amount < 1 || amount > 100) {
            warnCustom(interaction, `${amount} is an invalid number! __**Number must be between 1 and 100!**__`, clearSlashCommand.data.name);
            return;
        }

        const channel = await client.channels.fetch(interaction.channelId);

        if (!channel.isTextBased() || channel.isDMBased()) {
            return;
        }
        //#endregion

        channel
            .bulkDelete(amount, true)
            .then(() => {
                embedCustom(
                    interaction,
                    'Success!',
                    '#008000',
                    `Successfully deleted ${amount} messages!`,
                    {
                        text: `Requested by ${interaction.user.tag}`,
                        iconURL: null,
                    },
                    null,
                    [],
                    null,
                    null
                );
            })
            .catch((err) => {
                if (err.message == 'You can only bulk delete messages that are under 14 days old.') {
                    warnCustom(interaction, `You can only bulk delete messages that are under 14 days old.`, clearSlashCommand.data.name);
                    return;
                } else {
                    errorCustom(interaction, `An error occurred while attempting to delete! ${err.message}`, clearSlashCommand.data.name, client);
                    return;
                }
            });
    },
};
//#endregion

//#region Exports
export default clearSlashCommand;
//#endregion
