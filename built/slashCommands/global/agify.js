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
import { embedCustom, errorCustom, warnCustom } from '../../helpers/embedSlashMessages.js';
//#endregion
//#region This exports the agify command with the information about it
const agifySlashCommand = {
    data: new SlashCommandBuilder()
        .setName('agify')
        .setDescription("Estimates someone's age based off of their name.")
        .addStringOption((option) => option.setName('name').setDescription("The person's name you want to agify").setRequired(true)),
    execute(client, interaction, distube) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    embedCustom(interaction, 'Agify', '#5D3FD3', '\n The age of ' + capitalizedName + ' is estimated at ' + data.age + '.', {
                        text: `Requested by ${interaction.user.username}`,
                        iconURL: null,
                    }, null, [], null, null);
                }
                else {
                    errorCustom(interaction, 'The Agify API was unable to be reached at this time. \n Try again later.', this.name, client);
                }
            };
            request.send();
        });
    },
};
//#endregion
//#region Exports
export default agifySlashCommand;
//#endregion
