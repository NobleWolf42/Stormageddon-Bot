var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        .setName('quote')
        .setDescription('Display a random quote, picked by the developers of Stormageddon.'),
    execute(client, interaction, distube) {
        return __awaiter(this, void 0, void 0, function* () {
            var quote = quotedata[getRandomInt(quotedata.length)];
            embedCustom(interaction, 'Quote', '#000000', `"${quote.text}"\n Cited from ${quote.author}.\n Picked by ${yield client.users.fetch(quote.submitter)}.`, {
                text: `Requested by ${interaction.user.username}`,
                iconURL: null,
            }, null, [], null, null);
        });
    },
};
//#endregion
