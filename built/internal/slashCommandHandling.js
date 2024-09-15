var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//#region Imports
import { REST, Routes } from 'discord.js';
import { addToLog } from '../helpers/errorLog.js';
import { LogType } from '../models/loggingModel.js';
import { activeGlobalSlashCommands, activeGuildSlashCommands } from '../slashCommands/activeSlashCommands.js';
//#endregion
//#region Slash Command Handler
function slashCommandHandling(client, distube, collections) {
    return __awaiter(this, void 0, void 0, function* () {
        //This Loops through the active command array and adds them to the collection
        for (let i = 0; i < activeGlobalSlashCommands.length; i++) {
            const command = activeGlobalSlashCommands[i];
            if ('data' in command && 'execute' in command) {
                collections.slashCommands.set(command.data.name, command);
            }
            else {
                console.log(`[WARNING] The command at activeGlobalSlashCommands[${i}] is missing a required "data" or "execute" property.`);
            }
        }
        for (let i = 0; i < activeGuildSlashCommands.length; i++) {
            const command = activeGuildSlashCommands[i];
            if ('data' in command && 'execute' in command) {
                collections.slashCommands.set(command.data.name, command);
            }
            else {
                console.log(`[WARNING] The command at activeGuildSlashCommands[${i}] is missing a required "data" or "execute" property.`);
            }
        }
        client.on('interactionCreate', (interaction) => __awaiter(this, void 0, void 0, function* () {
            if (!interaction.isChatInputCommand()) {
                return;
            }
            const command = collections.slashCommands.get(interaction.commandName);
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
            try {
                yield command.execute(client, interaction, distube, collections);
            }
            catch (error) {
                console.error(error);
                if (interaction.channel.isDMBased()) {
                    addToLog(LogType.FatalError, command.data.name, interaction.user.tag, 'DM', 'DM', error, client);
                }
                else {
                    addToLog(LogType.FatalError, command.data.name, interaction.user.tag, interaction.guild.name, interaction.channel.name, error, client);
                }
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
        //This Loops through the active command array and adds them to the collection
        for (let i = 0; i < activeGuildSlashCommands.length; i++) {
            const command = activeGuildSlashCommands[i];
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
            }
            else {
                console.log(`[WARNING] The command at activeGuildSlashCommands[${i}] is missing a required "data" or "execute" property.`);
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
        //This Loops through the active command array and adds them to the collection
        for (let i = 0; i < activeGlobalSlashCommands.length; i++) {
            const command = activeGlobalSlashCommands[i];
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
            }
            else {
                console.log(`[WARNING] The command at activeGlobalSlashCommands[${i}] is missing a required "data" or "execute" property.`);
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
export { registerGlobalSlashCommands, registerGuildSlashCommands, slashCommandHandling };
//#endregion
