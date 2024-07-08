const { REST, Routes } = require('discord.js');
const serverConfig = require('./data/serverConfig.json');
const botConfig = require('./data/botConfig.json');

const rest = new REST().setToken(botConfig.auth.token);

// for guild-based commands
for (guildId in serverConfig) {
    rest.delete(Routes.applicationGuildCommand(botConfig.general.clientID, guildId, '1259523754447343681'))
	    .then(() => console.log('Successfully deleted guild command'))
	    .catch(console.error);
}

/*// for global commands
rest.delete(Routes.applicationCommand(clientId, 'commandId'))
	.then(() => console.log('Successfully deleted application command'))
	.catch(console.error);*/