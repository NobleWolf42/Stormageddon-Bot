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
import { SlashCommandBuilder } from 'discord.js';
import quotes from '../../data/quotes.js';
import { embedCustom } from '../../helpers/embedSlashMessages.js';
import { getRandomInt } from '../../helpers/math.js';
//endregion
//#region This exports the quote command with the information about it
const quoteSlashCommand = {
    data: new SlashCommandBuilder().setName('quote').setDescription('Display a random quote, picked by the developers of Stormageddon.'),
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            //#region Escape Logic
            if (!interaction.isChatInputCommand()) {
                return;
            }
            //#endregion
            const quote = quotes.data[getRandomInt(quotes.data.length)];
            embedCustom(interaction, 'Quote', '#000000', `"${quote.text}"\n Cited from ${quote.author}.\n Picked by ${yield client.users.fetch(quote.submitter)}.`, {
                text: `Requested by ${interaction.user.tag}`,
                iconURL: null,
            }, null, [], null, null);
        });
    },
};
//#endregion
//#region Exports
export default quoteSlashCommand;
//#endregion
