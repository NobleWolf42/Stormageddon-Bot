//#region Dependencies
const { REST, Routes } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require("path");
//#endregion

//#region Data Files
const botConfig = require('./data/botConfig.json');
//#endregion

//#region
async function slashCommandHandling(client, distube) {
    client.slashCommands = new Collection();

    const commandFiles = readdirSync(join(__dirname, "../slashCommands")).filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
        const command = require(join(__dirname, "../slashCommands", `${file}`));
        client.slashCommands.set(command.name, command);
    	if ('data' in command && 'execute' in command) {
    		client.slashCommands.set(command.data.name, command);
    	} else {
    		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    	}
    }

    client.on(Events.InteractionCreate, async interaction => {
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
	    	if (interaction.replied || interaction.deferred) {
	    		await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
	    	} else {
	    		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	    	}
	    }
    });
};
//#endregion

//#region
async function registerGuildSlashCommands() {

}
//#endregion

//#region
async function registerGlobalSlashCommands() {
    
}
//#endregion

//#region exports
module.exports = { slashCommandHandling, registerGuildSlashCommands, registerGlobalSlashCommands };
//#endregion