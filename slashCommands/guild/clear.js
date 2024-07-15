//#region Dependencies
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
//#endregion

//#region Helpers
const { errorCustom, embedCustom, warnCustom } = require('../../helpers/embedSlashMessages.js');
//#endregion

//#region This exports the clear command with the information about it
module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Bulk deletes the previous messages in a chat, up to 99 previous messages.")
        .addNumberOption(option =>
            option
                .setName("amount")
                .setDescription("The number of messages to delete (1-100).")
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(client, interaction, distube) {
        var channel = await client.channels.fetch(interaction.channelId);
        var amount = parseInt(interaction.options.getInteger("amount"));

        if(isNaN(amount)) {
            return warnCustom(interaction, `That is not a valid number for the clear command!`, module.name, client);
        } else if (amount < 1 || amount > 100) {
            return warnCustom(interaction, `${args[0]} is an invalid number! __**Number must be between 1 and 100!**__`, module.name, client);
        } else if(amount >= 1 && amount <= 100) {
            channel.bulkDelete(amount, true).then(() => { 
                return embedCustom(interaction, 'Success!', '#008000', `Successfully deleted ${amount} messages!`, { text: `Requested by ${interaction.user.username}`, iconURL: null }, null, [], null, null);
            }).catch(err => {
                if (err.message == "You can only bulk delete messages that are under 14 days old.") {
                    return warnCustom(interaction, `You can only bulk delete messages that are under 14 days old.`, module.name, client);
                } else {
                    return errorCustom(interaction, `An error occurred while attempting to delete! ${err.message}`, module.name, client);
                }
            });
        }
    }
}
//#endregion
