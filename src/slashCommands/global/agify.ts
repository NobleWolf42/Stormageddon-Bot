//#region Imports
import { SlashCommandBuilder } from 'discord.js';
import { embedCustom, errorCustom, warnCustom } from '../../helpers/embedSlashMessages.js';
import { SlashCommand } from '../../models/slashCommandModel.js';
import axios from 'axios';
//#endregion

//#region This exports the agify command with the information about it
const agifySlashCommand: SlashCommand = {
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

        //#region Main Logic - Reaches out to the agify api and handles the response
        axios.get('https://api.agify.io/?name=' + userInput).then((response) => {
            //Escape Logic in case api fails to respond with data
            if (response.status < 200 && response.status >= 400) {
                errorCustom(interaction, 'The Agify API was unable to be reached at this time. \n Try again later.', agifySlashCommand.data.name, client);
            }

            // Capitalizing the first letter of the returned name
            const capitalizedName = userInput.charAt(0).toUpperCase() + userInput.slice(1);

            embedCustom(
                interaction,
                'Agify',
                '#5D3FD3',
                '\n The age of ' + capitalizedName + ' is estimated at ' + response.data.age + '.',
                {
                    text: `Requested by ${interaction.user.tag}`,
                    iconURL: null,
                },
                null,
                [],
                null,
                null
            );
        });
        //#endregion
    },
};
//#endregion

//#region Exports
export default agifySlashCommand;
//#endregion
