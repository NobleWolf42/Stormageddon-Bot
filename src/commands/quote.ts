//#region Imports
import quoteData from '../data/quotes.js';
import { getRandomInt } from '../helpers/math.js';
import { embedCustom } from '../helpers/embedMessages.js';
import { Command } from '../models/commandModel.js';
//endregion

//#region This creates the quote command with the information about it
const quoteCommand: Command = {
    name: 'quote',
    type: ['DM', 'Guild'],
    aliases: [],
    coolDown: 5,
    class: 'fun',
    usage: 'quote',
    description: 'Display a random quote, picked by the developers of Stormageddon. (Works in Direct Messages too.)',
    async execute(message, _args, client) {
        const quote = quoteData.data[getRandomInt(quoteData.data.length)];

        embedCustom(
            message,
            'Quote',
            '#000000',
            `"${quote.text}"\n Cited from ${quote.author}.\n Picked by ${await client.users.fetch(quote.submitter)}.`,
            { text: `Requested by ${message.author.tag}`, iconURL: null },
            null,
            [],
            null,
            null
        );
    },
};
//#endregion

//#region Exports
export default quoteCommand;
//#endregion
