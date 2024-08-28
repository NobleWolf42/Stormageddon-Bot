"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var serverConfig_1 = require("./models/serverConfig");
var discord_js_1 = require("discord.js");
var serverConfigs = await serverConfig_1.MongooseServerConfig.find({ guildID: { $nin: [] } })
    .exec()
    .toObject();
var rest = new discord_js_1.REST().setToken(process.env.authToken);
// for guild-based commands
for (guildId in serverConfigs) {
    rest.delete(discord_js_1.Routes.applicationGuildCommand(process.env.clientID, guildId, 
    //command ID from discord
    '1259523754447343681'))
        .then(function () { return console.log('Successfully deleted guild command'); })
        .catch(console.error);
}
/*// for global commands
rest.delete(Routes.applicationCommand(clientId, 'commandId'))
    .then(() => console.log('Successfully deleted application command'))
    .catch(console.error);*/
