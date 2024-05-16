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
    cooldown: 5,
    class: 'fun',
    usage: 'quote',
    description: "Display a random quote, picked by the developers of Stormageddon.",
    execute(message) {
        var quote = quotedata[getRandomInt(quotedata.length)];

        embedCustom(message, 'Quote', '#000000', `"${quote.text}"\n Cited from ${quote.author}.\n Picked by ${quote.submitter}.`);
    }
}
//#endregion
