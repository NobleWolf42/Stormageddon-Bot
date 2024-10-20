import { MongooseServerConfig } from './models/serverConfig';
import { REST, Routes } from 'discord.js';
var serverConfigs = await MongooseServerConfig.find({ guildID: { $nin: [] } })
    .exec()
    .toObject();
const rest = new REST().setToken(process.env.authToken);
// for guild-based commands
for (guildId in serverConfigs) {
    rest.delete(Routes.applicationGuildCommand(process.env.clientID, guildId, 
    //command ID from discord
    '1259523754447343681'))
        .then(() => console.log('Successfully deleted guild command'))
        .catch(console.error);
}
/*// for global commands
rest.delete(Routes.applicationCommand(clientId, 'commandId'))
    .then(() => console.log('Successfully deleted application command'))
    .catch(console.error);*/
