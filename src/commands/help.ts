//#region Import
import { Command } from '../models/commandModel.js';
import { embedHelp, warnCustom, errorNoAdmin } from '../helpers/embedMessages.js';
import { adminCheck } from '../helpers/userPermissions.js';
import { capitalize } from '../helpers/stringHelpers.js';
import { MessageWithDeleted } from '../models/messagesModel.js';
//#endregion

//#region This creates the help command with the information about it
const helpCommand: Command = {
    name: 'help',
    type: ['DM', 'Guild'],
    coolDown: 0,
    aliases: ['h'],
    class: 'help',
    usage: 'help ***PAGE***',
    description:
        'Displays Help Message, specifying a page will show that help info, including a listing of all help pages. Using the **"All"** page will display all commands, the **"DM"** page will display all commands that can be Direct Messaged to the bot, and the **"Server"** page will display all commands that can be used in a discord server. (Works in Direct Messages too.)',
    async execute(message, args, _client, _distube, collections, serverConfig) {
        const lowerArgs = args.map((v) => v.toLowerCase());
        const adminTF = adminCheck(message.member, serverConfig);
        const commands = collections.commands;
        let commandClasses: string[] = [];
        let helpMessageCommands: Command[] = [];

        //Checks to see if your an admin and only adds the admin page to the commandClasses array if you are
        if (process.env.devIDs.includes(message.author.id)) {
            commands.forEach((cmd) => {
                if (!commandClasses.includes(capitalize(cmd.class))) {
                    commandClasses.push(capitalize(cmd.class));
                }
            });
        } else if (adminTF) {
            commands.forEach((cmd) => {
                if (!commandClasses.includes(capitalize(cmd.class)) && capitalize(cmd.class) != 'Developer') {
                    commandClasses.push(capitalize(cmd.class));
                }
            });
        } else {
            commands.forEach((cmd) => {
                if (!commandClasses.includes(capitalize(cmd.class)) && capitalize(cmd.class) != 'Developer' && capitalize(cmd.class) != 'Admin') {
                    commandClasses.push(capitalize(cmd.class));
                }
            });
        }

        //Makes the commandClasses array alphabetical
        commandClasses.sort();

        //Outputs the default help page if no page or help page is detected, otherwise handles it in the switch statement
        if (lowerArgs[0] == undefined || lowerArgs[0] == 'help') {
            commands.forEach((cmd) => {
                if (cmd.class == 'help') {
                    helpMessageCommands.push(cmd);
                }
            });
            return makeHelpMsg(message, 'Help', helpMessageCommands, commandClasses, adminTF);
        } else if (commandClasses.includes(capitalize(lowerArgs[0])) || lowerArgs[0] == 'all' || lowerArgs[0] == 'dm' || lowerArgs[0] == 'server') {
            //Switch case to output help page based on requested page
            switch (lowerArgs[0]) {
                //Outputs admin page if user is admin in the server its run in, otherwise sends an error message
                case 'admin':
                    if (adminTF) {
                        commands.forEach((cmd) => {
                            if (cmd.class == lowerArgs[0]) {
                                helpMessageCommands.push(cmd);
                            }
                        });

                        makeHelpMsg(message, `${capitalize(lowerArgs[0])} Help`, helpMessageCommands, commandClasses, adminTF);
                    } else {
                        errorNoAdmin(message, this.name);
                    }

                    break;

                //Outputs developer page if user is a dev, otherwise sends an error message
                case 'developer':
                    if (process.env.devIDs.includes(message.author.id)) {
                        commands.forEach((cmd) => {
                            if (cmd.class == lowerArgs[0]) {
                                helpMessageCommands.push(cmd);
                            }
                        });

                        makeHelpMsg(message, `${capitalize(lowerArgs[0])} Help`, helpMessageCommands, commandClasses, adminTF);
                    } else {
                        return warnCustom(message, `The **${lowerArgs[0]}** page you requested does not exit. Please select from these pages: \`${makeCommandPageList(commandClasses)}\``, this.name);
                    }

                    break;

                //Outputs all command pages that the user has access to
                case 'all':
                    for (let c = 0; c < commandClasses.length; c++) {
                        helpMessageCommands = [];
                        commands.forEach((cmd) => {
                            if (cmd.class == commandClasses[c].toLowerCase() && cmd.name != 'devsend') {
                                helpMessageCommands.push(cmd);
                            }
                        });

                        let title: string;

                        if (commandClasses[c].toLowerCase() != 'help') {
                            title = `${capitalize(commandClasses[c])} Help`;
                        } else {
                            title = 'Help';
                        }

                        makeHelpMsg(message, title, helpMessageCommands, commandClasses, adminTF);
                    }

                    break;

                //Outputs all commands that can be run in DMs
                case 'dm':
                    commandClasses = commandClasses.filter((i) => i.toLowerCase() != 'music');

                    for (let c = 0; c < commandClasses.length; c++) {
                        helpMessageCommands = [];
                        commands.forEach((cmd) => {
                            if (cmd.class == commandClasses[c].toLowerCase() && cmd.type.includes('DM') && cmd.name != 'devsend') {
                                helpMessageCommands.push(cmd);
                            }
                        });

                        let title: string;

                        if (commandClasses[c].toLowerCase() != 'help') {
                            title = `${capitalize(commandClasses[c])} Help`;
                        } else {
                            title = 'Help';
                        }

                        makeHelpMsg(message, title, helpMessageCommands, commandClasses, adminTF);
                    }

                    break;

                //Outputs all commands that can be run in a server
                case 'server':
                    for (let c = 0; c < commandClasses.length; c++) {
                        helpMessageCommands = [];
                        commands.forEach((cmd) => {
                            if (cmd.class == commandClasses[c].toLowerCase() && cmd.type.includes('Guild') && cmd.name != 'devsend') {
                                helpMessageCommands.push(cmd);
                            }
                        });

                        let title: string;

                        if (commandClasses[c].toLowerCase() != 'help') {
                            title = `${capitalize(commandClasses[c])} Help`;
                        } else {
                            title = 'Help';
                        }

                        makeHelpMsg(message, title, helpMessageCommands, commandClasses, adminTF);
                    }

                    break;

                //Outputs the commands for the chosen page
                default: {
                    commands.forEach((cmd) => {
                        if (cmd.class == lowerArgs[0] && cmd.name != 'devsend') {
                            helpMessageCommands.push(cmd);
                        }
                    });

                    makeHelpMsg(message, `${capitalize(lowerArgs[0])} Help`, helpMessageCommands, commandClasses, adminTF);

                    break;
                }
            }
        } else {
            return warnCustom(message, `The **${lowerArgs[0]}** page you requested does not exit. Please select from these pages: \`${makeCommandPageList(commandClasses)}\``, this.name);
        }
    },
};
//#endregion

//#region Function to create help message
/**
 *
 * @param message - Discord.js Message object
 * @param title - String for the title of the embed
 * @param helpMessageCommands - Array of the commands and their descriptions
 * @param commandClasses - Array of the different command classes
 * @param adminTF - Is the user an admin in the server y/n
 */
function makeHelpMsg(message: MessageWithDeleted, title: string, helpMessageCommands: Command[], commandClasses: string[], adminTF: boolean) {
    let helpMsg = '';
    commandClasses.sort();

    for (let i = 0; i < helpMessageCommands.length; i++) {
        const key = helpMessageCommands[i];
        const aliasesLength = key.aliases.length;

        if (aliasesLength == 0) {
            helpMsg += `${key.usage} - Aliases: None - ${key.description}`;
        } else if (aliasesLength == 1) {
            helpMsg += `${key.usage} - Aliases: ${key.aliases[0]} - ${key.description}`;
        } else {
            let aliasList = '';
            for (let a = 0; a < aliasesLength; a++) {
                if (a != aliasesLength - 1) {
                    aliasList += `${key.aliases[a]}, `;
                } else {
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
        embedHelp(message, title, `\`Help Pages: ${pageList}\`\n**NOTE: !help Admin can only be run in a server!!!\n\n**${helpMsg}`);
    } else {
        embedHelp(message, title, `\`Help Pages: ${pageList}\`\n\n${helpMsg}`);
    }
}
//#endregion

//#region Function to make list of command pages based off of their classes
/**
 * Command that makes the command page list from the commandClasses array.
 * @param commandClasses - Array of all the command classes
 * @returns String of all the command classes + DM, Server, and All.
 */
function makeCommandPageList(commandClasses: string[]) {
    let pageList = '';

    for (let i = 0; i < commandClasses.length; i++) {
        pageList += `${commandClasses[i]}, `;
    }

    pageList += `DM, Server, and All.`;

    return pageList;
}
//#endregion

//#region Exports
export default helpCommand;
//#endregion
