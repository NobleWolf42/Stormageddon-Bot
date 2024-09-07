//#region Dependencies
import { SlashCommandBuilder } from 'discord.js';
import { embedCustom } from '../../helpers/embedSlashMessages.js';
import { SlashCommand } from '../../models/slashCommandModel.js';
//#endregion

//#region This exports the info command with the information about it
const infoSlashCommand: SlashCommand = {
    data: new SlashCommandBuilder().setName('info').setDescription('Displays information about the bot.'),
    async execute(client, interaction, _distube) {
        //#region Escape Logic
        if (!interaction.isChatInputCommand()) {
            return;
        }
        //#endregion

        embedCustom(
            interaction,
            'Information',
            '#200132',
            `**Bot Name:** ${client.user}\n\n**Description:** All purpose bot, named after the worlds best Doggo, **${await client.users.fetch('211865015592943616')}'s** Stormageddon.\n\n**Designed and Built by:** *${await client.users.fetch('201665936049176576')}, ${await client.users.fetch('134900859560656896')}, ${await client.users.fetch('199716053729804288')}, and ${await client.users.fetch('207305619168952320')}*\n\n**How To Help:** If you would like to assist with the bot, you can find us on [\`Discord\`](https://discord.gg/tgJtK7f) , and on [\`GitHub\`](https://github.com/NobleWolf42/Stormageddon-Bot/).`,
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
export default infoSlashCommand;
//#endregion
