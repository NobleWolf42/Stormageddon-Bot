//#region Data Files
const quotedata = require('../data/quotes.json').data;
//#endregion

//#region Helpers
const { getRandomInt } = require('../helpers/math.js');
const { embedCustom } = require('../helpers/embedMessages.js');
//endregion

//#region This exports the quote command with the information about it
module.exports = {
    name: "quote",
    type: ['DM', 'Guild'],
    aliases: [],
    coolDown: 5,
    class: 'fun',
    usage: 'quote',
    description: "Display a random quote, picked by the developers of Stormageddon.",
    async execute(message, args, client, distube) {
        var quote = quotedata[getRandomInt(quotedata.length)];

        embedCustom(message, 'Quote', '#000000', `"${quote.text}"\n Cited from ${quote.author}.\n Picked by ${await(client.users.fetch(quote.submitter))}.`, { text: `Requested by ${message.author.tag}`, iconURL: null }, null, [], null, null);
    }
}
//#endregion
