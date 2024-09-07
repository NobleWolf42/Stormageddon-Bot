//#region Imports
import { SlashCommandBuilder } from 'discord.js';
import quotes from '../../data/quotes.js';
import { embedCustom } from '../../helpers/embedSlashMessages.js';
import { getRandomInt } from '../../helpers/math.js';
import { SlashCommand } from '../../models/slashCommandModel.js';
//endregion

//#region This exports the quote command with the information about it
const quoteSlashCommand: SlashCommand = {
    data: new SlashCommandBuilder().setName('quote').setDescription('Display a random quote, picked by the developers of Stormageddon.'),
    async execute(client, interaction) {
        //#region Escape Logic
        if (!interaction.isChatInputCommand()) {
            return;
        }
        //#endregion

        const quote = quotes.data[getRandomInt(quotes.data.length)];

        embedCustom(
            interaction,
            'Quote',
            '#000000',
            `"${quote.text}"\n Cited from ${quote.author}.\n Picked by ${await client.users.fetch(quote.submitter)}.`,
            {
                text: `Requested by ${interaction.user.tag}`,
                iconURL: null,
            },
            null,
            [],
            null,
            null
        );
    },
};
//#endregion

//#region Exports
export default quoteSlashCommand;
//#endregion
