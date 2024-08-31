//#region Imports
import { CommandInteraction, DefaultUserAgent, SlashCommandBuilder } from 'discord.js';
import { XMLHttpRequest } from 'xmlhttprequest';
import { embedCustom, errorCustom, warnCustom } from '../../helpers/embedSlashMessages.js';
import { SlashCommand } from '../../models/slashCommand.js';
//#endregion

//#region This exports the agify command with the information about it
const agifySlashCommand: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('agify')
        .setDescription("Estimates someone's age based off of their name.")
        .addStringOption((option) => option.setName('name').setDescription("The person's name you want to agify").setRequired(true)),
    async execute(client, interaction, distube) {
        const request = new XMLHttpRequest();

        if (!interaction.isChatInputCommand()) {
            return;
        }

        var userInput = interaction.options.getString('name').toLowerCase();

        if (userInput == undefined) {
            return warnCustom(interaction, 'No user input detected, are you sure you put a name?', this.name, client);
        }

        request.open('GET', 'https://api.agify.io/?name=' + userInput, true);
        request.onload = function () {
            // Begin accessing JSON data here
            var data = JSON.parse(request.responseText);

            if (request.status >= 200 && request.status < 400) {
                // Capitalizing the first letter of the returned name
                var capitalizedName = userInput.charAt(0).toUpperCase() + userInput.slice(1);

                embedCustom(
                    interaction,
                    'Agify',
                    '#5D3FD3',
                    '\n The age of ' + capitalizedName + ' is estimated at ' + data.age + '.',
                    {
                        text: `Requested by ${interaction.user.username}`,
                        iconURL: null,
                    },
                    null,
                    [],
                    null,
                    null
                );
            } else {
                errorCustom(interaction, 'The Agify API was unable to be reached at this time. \n Try again later.', this.name, client);
            }
        };

        request.send();
    },
};
//#endregion

//#region Exports
export default agifySlashCommand;
//#endregion
