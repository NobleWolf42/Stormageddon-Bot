//#region Initial Set-Up
    //#region Dependecies
    const Discord = require('discord.js');
    //#endregion

    //#region Configs
    const config = require('./data/botconfig.json');
    //#endregion

    //#region Helpers
    const filecreate = require('./helpers/createfiles.js');
    //#endregion

    //#region Internals
    const AutoRole = require('./internal/autorole.js');
    const MessageHandler = require('./internal/messagehandling.js');
    const ServerJoin = require('./internal/serverjoin.js');
    //#endregion
//#endregion

//#region Login / Initialize
// Initialize Discord Bot
const client = new Discord.Client();
client.queue = new Map();

//Throws Error if bot's token is not set.
if (config.auth.token === 'YOUR BOT TOKEN' || config.auth.token === '') {
    throw new Error("The 'auth.token' property is not set in the botconfig.json file. Please do this!");
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
    client.user.setActivity(`@me for more info and use the ! prefix when you dm me.`);
});

//Logs Errors
client.on('warn', (info) => console.log(info));
client.on('error', console.error);
//#endregion