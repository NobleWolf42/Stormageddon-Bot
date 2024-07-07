//#region Dependencies
const { SlashCommandBuilder } = require('discord.js');
//#endregion

//#region Data Files
const quotedata = require('../../data/quotes.json').data;
//#endregion

//#region Helpers
const { getRandomInt } = require('../../helpers/math.js');
const { embedCustom } = require('../../helpers/embedSlashMessages.js');
//endregion

//#region This exports the quote command with the information about it
module.exports = {
    data: new SlashCommandBuilder()
        .setName("quote")
        .setDescription("Display a random quote, picked by the developers of Stormageddon."),
    async execute(client, interaction, distube) {
        var quote = quotedata[getRandomInt(quotedata.length)];

        embedCustom(interaction, 'Quote', '#000000', `"${quote.text}"\n Cited from ${quote.author}.\n Picked by ${await(client.users.fetch(quote.submitter))}.`, { text: `Requested by ${interaction.user.username}`, iconURL: null }, null, [], null, null);
    }
}
//#endregion
