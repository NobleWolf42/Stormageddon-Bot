//#region Dependencies
var SlashCommandBuilder = require('discord.js').SlashCommandBuilder;
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
//#endregion
//#region Helpers
var _a = require('../../helpers/embedSlashMessages.js'), errorCustom = _a.errorCustom, embedCustom = _a.embedCustom;
//#endregion
//#region This exports the iss command with the information about it
module.exports = {
    data: new SlashCommandBuilder()
        .setName('iss')
        .setDescription('Displays the names of all the astronauts that are aboard the ISS.'),
    execute: function (client, interaction, distube) {
        var request = new XMLHttpRequest();
        request.open('GET', 'http://api.open-notify.org/astros.json', true);
        request.onload = function () {
            // Begin accessing JSON data here
            var data = JSON.parse(request.responseText);
            if (request.status >= 200 && request.status < 400) {
                var response = '';
                Array.from(data.people).forEach(function (people) {
                    response += '\n ' + people.name + ' : ' + people.craft;
                });
                embedCustom(interaction, 'Astronaut Information:', '#000000', response, {
                    text: "Requested by ".concat(interaction.user.username),
                    iconURL: null,
                }, null, [], null, null);
            }
            else {
                errorCustom(interaction, 'The ISS API was unable to be reached at this time. \n Try again later.', module.name, client);
            }
        };
        request.send();
    },
};
//#endregion
