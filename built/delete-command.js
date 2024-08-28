var _a = require('discord.js'), REST = _a.REST, Routes = _a.Routes;
var serverConfig = require('./data/serverConfig.json');
var rest = new REST().setToken(process.env.authToken);
// for guild-based commands
for (guildId in serverConfig) {
    rest.delete(Routes.applicationGuildCommand(process.env.clientID, guildId, 
    //command ID from discord
    '1259523754447343681'))
        .then(function () { return console.log('Successfully deleted guild command'); })
        .catch(console.error);
}
/*// for global commands
rest.delete(Routes.applicationCommand(clientId, 'commandId'))
    .then(() => console.log('Successfully deleted application command'))
    .catch(console.error);*/
