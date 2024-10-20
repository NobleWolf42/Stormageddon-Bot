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
import { SlashCommandBuilder } from 'discord.js';
import { embedHelp, errorNoAdmin, warnCustom } from '../../helpers/embedSlashMessages.js';
import { capitalize } from '../../helpers/stringHelpers.js';
import { adminCheck } from '../../helpers/userSlashPermissions.js';
import { MongooseServerConfig } from '../../models/serverConfigModel.js';
//#endregion
//#region This exports the help command with the information about it
const helpSlashCommand = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays Help Message.')
        .addStringOption((option) => option
        .setName('helppage')
        .setDescription('Select a help page (admin/direct/fun/gaming/help/music).')
        .setRequired(false)
        .setChoices({ name: 'Admin', value: 'admin' }, { name: 'Direct', value: 'direct' }, { name: 'Fun', value: 'fun' }, { name: 'Gaming', value: 'gaming' }, { name: 'Help', value: 'help' }, { name: 'Music', value: 'music' })),
    execute(_client, interaction, _distube, collections) {
        return __awaiter(this, void 0, void 0, function* () {
            //#region Escape Logic
            if (!interaction.isChatInputCommand()) {
                return;
            }
            //#endregion
            let adminTF = false;
            if (interaction.inGuild()) {
                const serverConfig = (yield MongooseServerConfig.findById(interaction.guildId).exec()).toObject();
                adminTF = adminCheck(interaction, serverConfig);
            }
            const commands = collections.commands;
            const commandClasses = [];
            const helpMessageCommands = [];
            //Checks to see if your an admin and only adds the admin page to the commandClasses array if you are
            if (process.env.devIDs.includes(interaction.user.id)) {
                commands.forEach((cmd) => {
                    if (!commandClasses.includes(capitalize(cmd.class))) {
                        commandClasses.push(capitalize(cmd.class));
                    }
                });
            }
            else if (adminTF) {
                commands.forEach((cmd) => {
                    if (!commandClasses.includes(capitalize(cmd.class)) && capitalize(cmd.class) != 'Developer') {
                        commandClasses.push(capitalize(cmd.class));
                    }
                });
            }
            else {
                commands.forEach((cmd) => {
                    if (!commandClasses.includes(capitalize(cmd.class)) && capitalize(cmd.class) != 'Developer' && capitalize(cmd.class) != 'Admin') {
                        commandClasses.push(capitalize(cmd.class));
                    }
                });
            }
            //Makes the commandClasses array alphabetical
            commandClasses.sort();
            //Outputs the default help page if no page or help page is detected, otherwise handles it in the switch statement
            if (interaction.options.getString('helppage') == undefined || interaction.options.getString('helppage') == 'help') {
                commands.forEach((cmd) => {
                    if (cmd.class == 'help') {
                        helpMessageCommands.push(cmd);
                    }
                });
                makeHelpMsg(interaction, 'Help', helpMessageCommands, commandClasses, adminTF);
                return;
            }
            else if (!commandClasses.includes(capitalize(interaction.options.getString('helppage'))) ||
                interaction.options.getString('helppage') == 'all' ||
                interaction.options.getString('helppage') == 'dm' ||
                interaction.options.getString('helppage') == 'server') {
                warnCustom(interaction, `The **${interaction.options.getString('helppage')}** page you requested does not exit. Please select from these pages: \`${makeCommandPageList(commandClasses)}\``, helpSlashCommand.data.name);
                return;
            }
            //Switch case to output help page based on requested page
            switch (interaction.options.getString('helppage')) {
                //Outputs admin page if user is admin in the server its run in, otherwise sends an error message
                case 'admin':
                    if (adminTF) {
                        commands.forEach((cmd) => {
                            if (cmd.class == interaction.options.getString('helppage')) {
                                helpMessageCommands.push(cmd);
                            }
                        });
                        makeHelpMsg(interaction, `${capitalize(interaction.options.getString('helppage'))} Help`, helpMessageCommands, commandClasses, adminTF);
                    }
                    else {
                        errorNoAdmin(interaction, helpSlashCommand.data.name);
                    }
                    break;
                //Outputs developer page if user is a dev, otherwise sends an error message
                case 'developer':
                    if (process.env.devIDs.split(',').includes(interaction.user.id)) {
                        commands.forEach((cmd) => {
                            if (cmd.class == interaction.options.getString('helppage')) {
                                helpMessageCommands.push(cmd);
                            }
                        });
                        makeHelpMsg(interaction, `${capitalize(interaction.options.getString('helppage'))} Help`, helpMessageCommands, commandClasses, adminTF);
                    }
                    else {
                        return warnCustom(interaction, `The **${interaction.options.getString('helppage')}** page you requested does not exit. Please select from these pages: \`${makeCommandPageList(commandClasses)}\``, helpSlashCommand.data.name);
                    }
                    break;
                //Outputs the commands for the chosen page
                default:
                    commands.forEach((cmd) => {
                        if (cmd.class == interaction.options.getString('helppage') && cmd.name != 'devsend') {
                            helpMessageCommands.push(cmd);
                        }
                    });
                    makeHelpMsg(interaction, `${capitalize(interaction.options.getString('helppage'))} Help`, helpMessageCommands, commandClasses, adminTF);
                    break;
            }
        });
    },
};
//#endregion
//#region Function to create help message
/**
 * This function makes the help message and send it
 * @param interaction Discord.js Interaction object
 * @param title Title of the help page
 * @param helpMessageCommands Array containing the commands
 * @param commandClasses Array containing the class types of commands
 * @param adminTF Tre/False based on if the user is an admin
 * @param client Discord.js Client object
 */
function makeHelpMsg(interaction, title, helpMessageCommands, commandClasses, adminTF) {
    let helpMsg = '';
    commandClasses.sort();
    for (let i = 0; i < helpMessageCommands.length; i++) {
        const key = helpMessageCommands[i];
        const aliasesLength = key.aliases.length;
        if (aliasesLength == 0) {
            helpMsg += `${key.usage} - Aliases: None - ${key.description}`;
        }
        else if (aliasesLength == 1) {
            helpMsg += `${key.usage} - Aliases: ${key.aliases[0]} - ${key.description}`;
        }
        else {
            let aliasList = '';
            for (let a = 0; a < aliasesLength; a++) {
                if (a != aliasesLength - 1) {
                    aliasList += `${key.aliases[a]}, `;
                }
                else {
                    aliasList += key.aliases[a];
                }
            }
            helpMsg += `${key.usage} - Aliases: ${aliasList} - ${key.description}`;
        }
        if (i != helpMessageCommands.length - 1) {
            helpMsg += `\n\n`;
        }
    }
    const pageList = makeCommandPageList(commandClasses);
    if (adminTF) {
        embedHelp(interaction, title, `\`Help Pages: ${pageList}\`\n**NOTE: !help Admin can only be run in a server!!!\n\n\n${helpMsg}`);
    }
    else {
        embedHelp(interaction, title, `\`Help Pages: ${pageList}\`\n${helpMsg}`);
    }
}
//#endregion
//#region Function to make list of command pages based off of their classes
function makeCommandPageList(commandClasses) {
    let pageList = '';
    for (let i = 0; i < commandClasses.length; i++) {
        pageList += `${commandClasses[i]}, `;
    }
    return pageList;
}
//#endregion
//#region
export default helpSlashCommand;
//#endregion
