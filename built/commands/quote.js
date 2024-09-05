var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//#region Imports
import quoteData from '../data/quotes.js';
import { getRandomInt } from '../helpers/math.js';
import { embedCustom } from '../helpers/embedMessages.js';
//endregion
//#region This creates the quote command with the information about it
const quoteCommand = {
    name: 'quote',
    type: ['DM', 'Guild'],
    aliases: [],
    coolDown: 5,
    class: 'fun',
    usage: 'quote',
    description: 'Display a random quote, picked by the developers of Stormageddon. (Works in Direct Messages too.)',
    execute(message, _args, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const quote = quoteData.data[getRandomInt(quoteData.data.length)];
            embedCustom(message, 'Quote', '#000000', `"${quote.text}"\n Cited from ${quote.author}.\n Picked by ${yield client.users.fetch(quote.submitter)}.`, { text: `Requested by ${message.author.tag}`, iconURL: null }, null, [], null, null);
        });
    },
};
//#endregion
//#region Exports
export default quoteCommand;
//#endregion
