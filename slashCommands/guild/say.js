//#region Dependencies
const { SlashCommandBuilder } = require('discord.js');
//#endregion

//#region Helpers
const { adminCheck } = require('../../helpers/userPermissions.js');
const { errorNoAdmin, errorCustom } = require('../../helpers/embedSlashMessages.js');
//#endregion

//#region This exports the say command with the information about it
module.exports = {
    data: new SlashCommandBuilder()
        .setName("say")
        .setDescription("Sends message as bot.")
        .addStringOption(option =>
            option
                .setName("message")
                .setDescription("Message to send as the bot.")
                .setRequired(true)
        ),
    execute(client, interaction, distube) {
        if (adminCheck(interaction)) {
            var argsString = interaction.options.getString("message");
                
            if (argsString != '') {
                interaction.reply(argsString);
            }
            else {
                return errorCustom(interaction, "Cannot send an empty message!", module.name, client);
            }
        }
        else {
            return errorNoAdmin(interaction, module.name, client);
        }
    }
}
//#endregion
