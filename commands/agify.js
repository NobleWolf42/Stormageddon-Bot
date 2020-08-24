//#region Dependcies
const { XMLHttpRequest } = require("xmlhttprequest");
//#endregion

//#region Agify Command
module.exports = {
    name: "agify",
    type: ['Guild', 'DM'],
    aliases: [],
    cooldown: 0,
    class: 'fun',
    usage: 'agify ***INSERT-NAME***',
    description: "Estimates someone's age based off of their name.",
    execute(message) {
        const request = new XMLHttpRequest();
        var userInput = message.content.toLowerCase().split(' ');
    
        request.open('GET', 'https://api.agify.io/?name='+userInput[1], true)
        request.onload = function() {
            // Begin accessing JSON data here
            var data = JSON.parse(request.responseText)

            if (request.status >= 200 && request.status < 400) {
                // Capitalizing the first lettter of the returned name
                var capitalizedname = userInput[1].charAt(0).toUpperCase() + userInput[1].slice(1);

                message.reply("\n The age of " + capitalizedname + " is estimated at " + data.age + ".");
            } else {
                console.log('error');
                message.reply("The Agify API was unable to be reached at this time. \n Try again later.");
            }
        }

        request.send()
    }
}
//#endregion