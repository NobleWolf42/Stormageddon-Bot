//#region Imports
import { SlashCommandBuilder } from 'discord.js';
import { embedCustom, errorCustom, warnCustom } from '../../helpers/embedSlashMessages.js';
//#endregion
//#region This exports the agify command with the information about it
const agifySlashCommand = {
    data: new SlashCommandBuilder()
        .setName('agify')
        .setDescription("Estimates someone's age based off of their name.")
        .addStringOption((option) => option.setName('name').setDescription("The person's name you want to agify").setRequired(true)),
    execute(client, interaction) {
        //#region Escape Logic
        if (!interaction.isChatInputCommand()) {
            return;
        }
        const userInput = interaction.options.getString('name').toLowerCase();
        if (userInput == undefined) {
            warnCustom(interaction, 'No user input detected, are you sure you put a name?', this.name);
            return;
        }
        //#endregion
        //#region Main Logic - Retrieves age from agify.io's api based on user input
        const request = new XMLHttpRequest();
        request.open('GET', 'https://api.agify.io/?name=' + userInput, true);
        request.onload = function () {
            // Begin accessing JSON data here
            const data = JSON.parse(request.responseText);
            if (request.status < 200 && request.status >= 400) {
                errorCustom(interaction, 'The Agify API was unable to be reached at this time. \n Try again later.', agifySlashCommand.data.name, client);
            }
            // Capitalizing the first letter of the returned name
            const capitalizedName = userInput.charAt(0).toUpperCase() + userInput.slice(1);
            embedCustom(interaction, 'Agify', '#5D3FD3', '\n The age of ' + capitalizedName + ' is estimated at ' + data.age + '.', {
                text: `Requested by ${interaction.user.username}`,
                iconURL: null,
            }, null, [], null, null);
        };
        request.send();
    },
};
//#endregion
//#region Exports
export default agifySlashCommand;
//#endregion
