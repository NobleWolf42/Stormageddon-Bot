//#region Dependencies
const { REST, Routes, Collection } = require('discord.js');
const { readdirSync, readFileSync } = require('fs');
const { join } = require("path");
//#endregion

//#region Data Files
const botConfig = require('../data/botConfig.json');
const { addToLog } = require('../helpers/errorLog.js');
//#endregion

//#region Slash Command Handler
async function slashCommandHandling(client, distube) {
    client.slashCommands = new Collection();

    const foldersPath = join(__dirname, '../slashCommands');
    const commandFolders = readdirSync(foldersPath);

    for (const folder of commandFolders) {
    	const commandsPath = join(foldersPath, folder);
    	const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    	for (const file of commandFiles) {
    		const filePath = join(commandsPath, file);
    		const command = require(filePath);
    		// Set a new item in the Collection with the key as the command name and the value as the exported module
    		if ('data' in command && 'execute' in command) {
    			client.slashCommands.set(command.data.name, command);
    		} else {
    			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    		}
    	}
    }

    client.on("interactionCreate", async interaction => {
        if (!interaction.isChatInputCommand()) {
            return;
        }
        
        const command = interaction.client.slashCommands.get(interaction.commandName);

	    if (!command) {
	    	console.error(`No command matching ${interaction.commandName} was found.`);
	    	return;
	    }

	    try {
	    	await command.execute(client, interaction, distube);
	    } catch (error) {
	    	console.error(error);
            var guild = null;
            if (interaction.guildId) {
                guild = interaction.guild.name;
            }
            var channel = await client.channels.fetch(interaction.channelId);
            addToLog("fatal error", command.data.name, interaction.user.username, guild, channel.name, error, client);
	    	if (interaction.replied || interaction.deferred) {
	    		await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
	    	} else {
	    		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	    	}
	    }
    });
};
//#endregion

//#region Registers Guild Slash Commands with discord
async function registerGuildSlashCommands(guildId) {
    const commands = [];
    const commandFiles = readdirSync(join(__dirname, "../slashCommands/guild")).filter((file) => file.endsWith(".js"));
    
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
        const command = require(join(__dirname, "../slashCommands/guild", `${file}`));
        if ('data' in command && 'execute' in command) {
    		commands.push(command.data.toJSON());
    	} else {
    		console.log(`[WARNING] The command at ../slashCommands/guild/${file} is missing a required "data" or "execute" property.`);
    	}
    }

    // Construct and prepare an instance of the REST module
    const rest = new REST().setToken(botConfig.auth.token);

    // and deploy your commands!
    (async () => {
        try {
    	    console.log(`Started refreshing ${commands.length} guild (/) commands.`);

    	    // The put method is used to fully refresh all commands in the guild with the current set
    	    const data = await rest.put(
    	    	Routes.applicationGuildCommands(botConfig.general.clientID, guildId),
    	    	{ body: commands },
    	    );

    	    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
    	    // And of course, make sure you catch and log any errors!
    	    console.error(error);
        }
    })();
}
//#endregion

//#region Registers Global Slash Commands with discord
async function registerGlobalSlashCommands() {
    const commands = [];
    const commandFiles = readdirSync(join(__dirname, "../slashCommands/global")).filter((file) => file.endsWith(".js"));
    
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
        const command = require(join(__dirname, "../slashCommands/global", `${file}`));
        if ('data' in command && 'execute' in command) {
    		commands.push(command.data.toJSON());
    	} else {
    		console.log(`[WARNING] The command at ../slashCommands/global/${file} is missing a required "data" or "execute" property.`);
    	}
    }

    // Construct and prepare an instance of the REST module
    const rest = new REST().setToken(botConfig.auth.token);

    // and deploy your commands!
    (async () => {
    	try {
    		console.log(`Started refreshing ${commands.length} application (/) commands.`);
            console.log(`Global: ${botConfig.general}`);

    		// The put method is used to fully refresh all commands in the guild with the current set
    		const data = await rest.put(
    			Routes.applicationCommands(botConfig.general.clientID),
    			{ body: commands },
    		);

    		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    	} catch (error) {
    		// And of course, make sure you catch and log any errors!
    		console.error(error);
    	}
    })();
}
//#endregion

//#region exports
module.exports = { slashCommandHandling, registerGuildSlashCommands, registerGlobalSlashCommands };
//#endregion