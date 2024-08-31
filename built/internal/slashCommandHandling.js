var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//#region Dependencies
import { REST, Routes, Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
//#endregion
//#region Helpers
import { addToLog } from '../helpers/errorLog';
//#endregion
//#region Slash Command Handler
function slashCommandHandling(client, distube) {
    return __awaiter(this, void 0, void 0, function* () {
        client.slashCommands = new Collection();
        const foldersPath = join(__dirname, '../slashCommands');
        const commandFolders = readdirSync(foldersPath);
        for (const folder of commandFolders) {
            const commandsPath = join(foldersPath, folder);
            const commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
            for (const file of commandFiles) {
                const filePath = join(commandsPath, file);
                const command = require(filePath);
                // Set a new item in the Collection with the key as the command name and the value as the exported module
                if ('data' in command && 'execute' in command) {
                    client.slashCommands.set(command.data.name, command);
                }
                else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                }
            }
        }
        client.on('interactionCreate', (interaction) => __awaiter(this, void 0, void 0, function* () {
            if (!interaction.isChatInputCommand()) {
                return;
            }
            const command = interaction.client.slashCommands.get(interaction.commandName);
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
            try {
                yield command.execute(client, interaction, distube);
            }
            catch (error) {
                console.error(error);
                var guild = null;
                if (interaction.guildId) {
                    guild = interaction.guild.name;
                }
                var channel = yield client.channels.fetch(interaction.channelId);
                addToLog('fatal error', command.data.name, interaction.user.username, guild, channel.name, error, client);
                if (interaction.replied || interaction.deferred) {
                    yield interaction.followUp({
                        content: 'There was an error while executing this command!',
                        ephemeral: true,
                    });
                }
                else {
                    yield interaction.reply({
                        content: 'There was an error while executing this command!',
                        ephemeral: true,
                    });
                }
            }
        }));
    });
}
//#endregion
//#region Registers Guild Slash Commands with discord
function registerGuildSlashCommands(guildId) {
    return __awaiter(this, void 0, void 0, function* () {
        const commands = [];
        const commandFiles = readdirSync(join(__dirname, '../slashCommands/guild')).filter((file) => file.endsWith('.js'));
        // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
        for (const file of commandFiles) {
            const command = require(join(__dirname, '../slashCommands/guild', `${file}`));
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
            }
            else {
                console.log(`[WARNING] The command at ../slashCommands/guild/${file} is missing a required "data" or "execute" property.`);
            }
        }
        // Construct and prepare an instance of the REST module
        const rest = new REST().setToken(process.env.authToken);
        // and deploy your commands!
        (() => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`Started refreshing ${commands.length} guild (/) commands.`);
                // The put method is used to fully refresh all commands in the guild with the current set
                const data = yield rest.put(Routes.applicationGuildCommands(process.env.clientID, guildId), { body: commands });
                console.log(`Successfully reloaded ${data.length} application (/) commands.`);
            }
            catch (error) {
                // And of course, make sure you catch and log any errors!
                console.error(error);
            }
        }))();
    });
}
//#endregion
//#region Registers Global Slash Commands with discord
function registerGlobalSlashCommands() {
    return __awaiter(this, void 0, void 0, function* () {
        const commands = [];
        const commandFiles = readdirSync(join(__dirname, '../slashCommands/global')).filter((file) => file.endsWith('.js'));
        // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
        for (const file of commandFiles) {
            const command = require(join(__dirname, '../slashCommands/global', `${file}`));
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
            }
            else {
                console.log(`[WARNING] The command at ../slashCommands/global/${file} is missing a required "data" or "execute" property.`);
            }
        }
        // Construct and prepare an instance of the REST module
        const rest = new REST().setToken(process.env.authToken);
        // and deploy your commands!
        (() => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`Started refreshing ${commands.length} application (/) commands.`);
                // The put method is used to fully refresh all commands in the guild with the current set
                const data = yield rest.put(Routes.applicationCommands(process.env.clientID), { body: commands });
                console.log(`Successfully reloaded ${data.length} application (/) commands.`);
            }
            catch (error) {
                // And of course, make sure you catch and log any errors!
                console.error(error);
            }
        }))();
    });
}
//#endregion
//#region exports
module.exports = {
    slashCommandHandling,
    registerGuildSlashCommands,
    registerGlobalSlashCommands,
};
//#endregion
