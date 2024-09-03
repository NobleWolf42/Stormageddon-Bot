//#region Imports
import { ApplicationCommand, Client, Collection, REST, Routes } from 'discord.js';
import { DisTube } from 'distube';
import { addToLog } from '../helpers/errorLog.js';
import { activeGlobalSlashCommands, activeGuildSlashCommands } from '../slashCommands/activeSlashCommands.js';
import { ExtraCollections } from '../models/extraCollectionsModel.js';
//#endregion

//#region Slash Command Handler
async function slashCommandHandling(client: Client, distube: DisTube, collections: ExtraCollections) {
    collections.slashCommands = new Collection();

    //This Loops through the active command array and adds them to the collection
    for (let i = 0; i < activeGlobalSlashCommands.length; i++) {
        const command = activeGlobalSlashCommands[i];
        if ('data' in command && 'execute' in command) {
            collections.slashCommands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at activeGlobalSlashCommands[${i}] is missing a required "data" or "execute" property.`);
        }
    }

    for (let i = 0; i < activeGuildSlashCommands.length; i++) {
        const command = activeGuildSlashCommands[i];
        if ('data' in command && 'execute' in command) {
            collections.slashCommands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at activeGuildSlashCommands[${i}] is missing a required "data" or "execute" property.`);
        }
    }

    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isChatInputCommand()) {
            return;
        }

        const command = collections.slashCommands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(client, interaction, distube);
        } catch (error) {
            console.error(error);
            var channel = await client.channels.fetch(interaction.channelId);
            if (channel.isDMBased()) {
                addToLog('fatal error', command.data.name, interaction.user.username, 'DM', 'DM', error, client);
            } else {
                addToLog('fatal error', command.data.name, interaction.user.username, interaction.guild.name, channel.name, error, client);
            }
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
async function registerGuildSlashCommands(guildId: string) {
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

            console.log(`Successfully reloaded ${(<ApplicationCommand[]>data).length} application (/) commands.`);
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

            console.log(`Successfully reloaded ${(<ApplicationCommand[]>data).length} application (/) commands.`);
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    })();
}
//#endregion

//#region exports
export { registerGlobalSlashCommands, registerGuildSlashCommands, slashCommandHandling };
//#endregion
