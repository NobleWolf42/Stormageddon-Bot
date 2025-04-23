//#region Imports
import { XMLHttpRequest } from 'xmlhttprequest-ts';
import { SlashCommandBuilder } from 'discord.js';
import { embedCustom, errorCustom } from '../../helpers/embedSlashMessages.js';
import { SlashCommand } from '../../models/slashCommandModel.js';
//#endregion

//#region This exports the iss command with the information about it
const issSlashCommand: SlashCommand = {
    data: new SlashCommandBuilder().setName('iss').setDescription('Displays the names of all the astronauts that are aboard the ISS.'),
    execute(client, interaction) {
        //#region Escape Logic
        if (!interaction.isChatInputCommand()) {
            return;
        }
        //#endregion

        const request = new XMLHttpRequest();
        request.open('GET', 'http://api.open-notify.org/astros.json', true);
        request.onload = function () {
            // Begin accessing JSON data here
            const data: {
                people: [{ craft: string; name: string }];
                number: number;
                message: string;
            } = JSON.parse(request.responseText);

            if (request.status < 200 && request.status >= 400) {
                errorCustom(interaction, 'The ISS API was unable to be reached at this time. \n Try again later.', issSlashCommand.data.name, client);
            }

            let response = '';

            Array.from(data.people).forEach(function (people) {
                response += '\n ' + people.name + ' : ' + people.craft;
            });

            embedCustom(
                interaction,
                'Astronaut Information:',
                '#000000',
                response,
                {
                    text: `Requested by ${interaction.user.tag}`,
                    iconURL: null,
                },
                null,
                [],
                null,
                null
            );
        };

        request.send();
    },
};
//#endregion

//#region Exports
export default issSlashCommand;
//#endregion
