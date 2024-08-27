const { REST, Routes } = require('discord.js');
const serverConfig = require('./data/serverConfig.ts');

const rest = new REST().setToken(process.env.authToken);

// for guild-based commands
for (guildId in serverConfig) {
    rest.delete(
        Routes.applicationGuildCommand(
            process.env.clientID,
            guildId,
            //command ID from discord
            '1259523754447343681'
        )
    )
        .then(() => console.log('Successfully deleted guild command'))
        .catch(console.error);
}

/*// for global commands
rest.delete(Routes.applicationCommand(clientId, 'commandId'))
	.then(() => console.log('Successfully deleted application command'))
	.catch(console.error);*/
