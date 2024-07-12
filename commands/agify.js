//#region Dependencies
const { XMLHttpRequest } = require("xmlhttprequest");
//#endregion

//#region Helpers
const { errorCustom, warnCustom, embedCustom } = require("../helpers/embedMessages.js");
//#endregion

//#region This exports the agify command with the information about it
module.exports = {
    name: "agify",
    type: ['Guild', 'DM'],
    aliases: [],
    coolDown: 0,
    class: 'fun',
    usage: 'agify ***INSERT-NAME***',
    description: "Uses [Agify.io](https://agify.io/) to estimate someone's age based off of their name. (Works in Direct Messages too.)",
    execute(message, args, client, distube) {
        const request = new XMLHttpRequest();
        var userInput = message.content.toLowerCase().split(' ');

        if (userInput[1] == undefined) {
            return warnCustom(message, "No user input detected, are you sure you put a name?", module.name);
        }
    
        request.open('GET', 'https://api.agify.io/?name='+userInput[1], true)
        request.onload = function() {
            // Begin accessing JSON data here
            var data = JSON.parse(request.responseText)

            if (request.status >= 200 && request.status < 400) {
                // Capitalizing the first letter of the returned name
                var capitalizedName = userInput[1].charAt(0).toUpperCase() + userInput[1].slice(1);

                embedCustom(message, "Agify", "#5D3FD3", "\n The age of " + capitalizedName + " is estimated at " + data.age + ".", { text: `Requested by ${message.author.tag}`, iconURL: null }, null,[],null,null);
            } else {
                errorCustom(message, "The Agify API was unable to be reached at this time. \n Try again later.", module.name, client);
            }
        }

        request.send()
    }
}
//#endregion
