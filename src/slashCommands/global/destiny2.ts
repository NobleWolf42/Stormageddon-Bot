//#region Imports
import { Client, Interaction, SlashCommandBuilder } from 'discord.js';
import { embedCustom, warnCustom, errorCustom } from '../../helpers/embedSlashMessages.js';
import { SlashCommand } from '../../models/slashCommandModel.js';
//#endregion

//#region This exports the destiny2 command with the information about it
const destiny2SlashCommand: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('destiny2')
        .setDescription('Displays information from Destiny 2 servers.')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('clan')
                .setDescription("Displays Destiny 2 clan's bio, avatar, motto, and founder")
                .addStringOption((option) => option.setName('clanname').setDescription('Name of clan you want to see information on.').setRequired(true))
        ),
    execute(client, interaction) {
        //#region Escape Logic
        if (!interaction.isChatInputCommand()) {
            return;
        }

        if (interaction.options.getSubcommand() != 'clan') {
            warnCustom(interaction, 'You did not use the command correctly, please try again.', destiny2SlashCommand.data.name);
        }
        //#endregion

        //#region Main Logic - Gets clan information based oof user input
        const clanName = interaction.options.getString('clanname');
        getClan(interaction, clanName, client);
        //#endregion
    },
};
//#endregion

//#region Gets the information of the destiny 2 clan by name
function getClan(interaction: Interaction, clan_name: string, client: Client) {
    if (!interaction.isChatInputCommand()) {
        return;
    }

    // Request initialized and created
    const request = new XMLHttpRequest();
    request.open('GET', 'https://www.bungie.net/Platform/GroupV2/Name/' + clan_name + '/1', true);
    request.setRequestHeader('X-API-KEY', process.env.d2ApiKey);
    request.onload = function () {
        //#region Escape Logic
        if (request.status < 200 && request.status >= 400) {
            warnCustom(interaction, `The Search for \`${clan_name}\` returned no results.\n Try something else.`, destiny2SlashCommand.data.name);
            return;
        }

        const data = JSON.parse(request.responseText)['Response'];

        if (data == null && data == undefined) {
            errorCustom(interaction, 'The Destiny API was unable to be reached at this time.\n Try again later.', destiny2SlashCommand.data.name, client);
        }

        const error = JSON.parse(request.responseText);

        if (error.ErrorStatus == 'ClanNotFound') {
            warnCustom(interaction, `The Search for \`${clan_name}\` returned no results.\n Try something else.`, destiny2SlashCommand.data.name);
        }
        //#endregion

        const domain = 'https://www.bungie.net/';

        const attachment = domain + data['founder']['bungieNetUserInfo']['iconPath'];
        embedCustom(
            interaction,
            `${clan_name} Clan Information`,
            '#F5F5F5',
            `The clan was created on ${data['detail']['creationDate']}.\n The founder is ${data['founder']['bungieNetUserInfo']['displayName']}.\n\n ${data['detail']['about']}`,
            {
                text: `Requested by ${interaction.user.username}`,
                iconURL: null,
            },
            attachment,
            [],
            null,
            null
        );
    };

    request.send();
}
//#endregion

//#region Exports
export default destiny2SlashCommand;
//#endregion
