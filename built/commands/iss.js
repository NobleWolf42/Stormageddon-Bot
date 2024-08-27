//#region Dependencies
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
//#endregion
//#region Helpers
var _a = require('../helpers/embedMessages.js'), errorCustom = _a.errorCustom, embedCustom = _a.embedCustom;
//#endregion
//#region This exports the iss command with the information about it
module.exports = {
    name: 'iss',
    type: ['DM', 'Guild'],
    aliases: [],
    coolDown: 60,
    class: 'fun',
    usage: 'iss',
    description: 'Displays the names of all the astronauts that are in transit to/from, or currently aboard the International Space Station. (Works in Direct Messages too.)',
    execute: function (message, args, client, distube) {
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
                embedCustom(message, 'Astronaut Information:', '#000000', response, {
                    text: "Requested by ".concat(message.author.tag),
                    iconURL: null,
                }, null, [], null, null);
            }
            else {
                errorCustom(message, 'The ISS API was unable to be reached at this time. \n Try again later.', module.name, client);
            }
        };
        request.send();
    },
};
//#endregion
