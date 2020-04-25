//#region Initial set-up
    //#region dependecies
    var Discord = require('discord.js');

    var config = require('./data/botconfig.json');

    var filecreate = require('./helpers/createfiles.js');

    var AutoRole = require('./internal/autorole.js');
    var MessageHandler = require('./internal/messagehandling.js');
    var ServerJoin = require('./internal/serverjoin.js');
    //#endregion
//#endregion

//#region Login / Initialize
// Initialize Discord Bot
var client = new Discord.Client();

//Throws Error if bot's token is not set.
if (config.auth.token === 'YOUR BOT TOKEN' || config.auth.token === '') {
    throw new Error("The 'auth.token' property is not set in the config.js file. Please do this!");
}

//Logs the bot into discord, using it's auth token
client.login(config.auth.token);

//Logs the Bot info when bot starts
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    filecreate.createJSONfiles();
    AutoRole.autoroleListener(client);
    MessageHandler.messageHandling(client);
    MessageHandler.PMHandling(client);
    ServerJoin.serverJoin(client);
    client.user.setPresence({ game: { name: `@me for more info` } });
});

//Logs Errors
client.on('error', console.error);
//#endregion