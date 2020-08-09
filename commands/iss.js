//#region Dependancies
const { XMLHttpRequest } = require("xmlhttprequest");
const { errorCustom, embedCustom } = require('../helpers/embedMessages.js');
//#endregion

//#region ISS Command
module.exports = {
    name: "iss",
    type: ['DM', 'Gulid'],
    aliases: [],
    cooldown: 60,
    class: 'fun',
    usage: 'iss',
    description: "Displays the names of all the astronauts that are aboard the ISS.",
    execute(message){
        var request = new XMLHttpRequest()
        request.open('GET', 'http://api.open-notify.org/astros.json', true);
        request.onload = function() {
            // Begin accessing JSON data here
            var data = JSON.parse(request.responseText);

            if (request.status >= 200 && request.status < 400) {
                var response = "";

                Array.from(data.people).forEach(function(people){
                response += "\n " + people.name + " : " + people.craft;
                });
         
                embedCustom(message, 'Astronaut Information: ', '#000000', response);
            } else {
                errorCustom(message, 'The ISS API was unable to be reached at this time. \n Try again later.');
            }
        }

        request.send();
    }
}
//#endregion