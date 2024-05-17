//#region Helpers
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
    description: "Estimates someone's age based off of their name.",
    execute(message) {
        const request = new XMLHttpRequest();
        var userInput = message.content.toLowerCase().split(' ');

        console.log(userInput);

        if (userInput[1] == undefined) {
            warnCustom(message, "No user input detected, are you sure you put a name?", module.name);
            return;
        }
    
        request.open('GET', 'https://api.agify.io/?name='+userInput[1], true)
        request.onload = function() {
            // Begin accessing JSON data here
            var data = JSON.parse(request.responseText)

            if (request.status >= 200 && request.status < 400) {
                // Capitalizing the first letter of the returned name
                var capitalizedName = userInput[1].charAt(0).toUpperCase() + userInput[1].slice(1);

                message.reply("\n The age of " + capitalizedName + " is estimated at " + data.age + ".");
            } else {
                errorCustom(message, "The Agify API was unable to be reached at this time. \n Try again later.", module.name);
            }
        }

        request.send()
    }
}
//#endregion
