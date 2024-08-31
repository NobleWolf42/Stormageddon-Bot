//#region Imports
import { Collection, REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { addToLog } from '../helpers/errorLog.js';
import { DisTube } from 'distube';
import { activeGlobalSlashCommands, activeGuildSlashCommands } from '../slashCommands/activeSlashCommands.js';
import { CommandClient } from '../models/client.js';
//#endregion

//#region Slash Command Handler
async function slashCommandHandling(client: CommandClient, distube: DisTube) {
    client.slashCommands = new Collection();

    //This Loops through the active command array and adds them to the collection
    for (let i = 0; i < activeGlobalSlashCommands.length; i++) {
        const command = activeGlobalSlashCommands[i];
        if ('data' in command && 'execute' in command) {
            client.slashCommands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at activeGlobalSlashCommands[${i}] is missing a required "data" or "execute" property.`);
        }
    }

    for (let i = 0; i < activeGuildSlashCommands.length; i++) {
        const command = activeGuildSlashCommands[i];
        if ('data' in command && 'execute' in command) {
            client.slashCommands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at activeGuildSlashCommands[${i}] is missing a required "data" or "execute" property.`);
        }
    }

    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isChatInputCommand()) {
            return;
        }

        const interactionClient: CommandClient = interaction.client;
        const command = interactionClient.slashCommands.get(interaction.commandName);

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
            addToLog('fatal error', command.data.name, interaction.user.username, guild, channel.name, error, client);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: 'There was an error while executing this command!',
                    ephemeral: true,
                });
            } else {
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    ephemeral: true,
                });
            }
        }
    });
}
//#endregion

//#region Registers Guild Slash Commands with discord
async function registerGuildSlashCommands(guildId) {
    let commands = [];
    //This Loops through the active command array and adds them to the collection
    for (let i = 0; i < activeGuildSlashCommands.length; i++) {
        const command = activeGuildSlashCommands[i];
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The command at activeGuildSlashCommands[${i}] is missing a required "data" or "execute" property.`);
        }
    }

    // Construct and prepare an instance of the REST module
    const rest = new REST().setToken(process.env.authToken);

    // and deploy your commands!
    (async () => {
        try {
            console.log(`Started refreshing ${commands.length} guild (/) commands.`);

            // The put method is used to fully refresh all commands in the guild with the current set
            const data = await rest.put(Routes.applicationGuildCommands(process.env.clientID, guildId), { body: commands });

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
    let commands = [];
    //This Loops through the active command array and adds them to the collection
    for (let i = 0; i < activeGlobalSlashCommands.length; i++) {
        const command = activeGlobalSlashCommands[i];
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The command at activeGlobalSlashCommands[${i}] is missing a required "data" or "execute" property.`);
        }
    }

    // Construct and prepare an instance of the REST module
    const rest = new REST().setToken(process.env.authToken);

    // and deploy your commands!
    (async () => {
        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);

            // The put method is used to fully refresh all commands in the guild with the current set
            const data = await rest.put(Routes.applicationCommands(process.env.clientID), { body: commands });

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    })();
}
//#endregion

//#region exports
export { slashCommandHandling, registerGuildSlashCommands, registerGlobalSlashCommands };
//#endregion
