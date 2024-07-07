//#region Dependencies
const { SlashCommandBuilder } = require('discord.js');
//#endregion

//#region Helpers
const { embedHelp, warnCustom, errorNoAdmin } = require('../../helpers/embedSlashMessages.js');
const { adminCheck } = require('../../helpers/userPermissions.js');
const { capitalize } = require('../../helpers/stringHelpers.js');
//#endregion

//#region This exports the help command with the information about it
module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription("Displays Help Message.")
        .addStringOption(option =>
            option
                .setName("helppage")
                .setDescription("Select a help page (admin/all/dm/server).")
                .setRequired(false)
                .setChoices(
                    { name: 'Admin', value: 'admin' },
                    { name: 'All', value: 'all' },
                    { name: 'DM', value: 'dm' },
                    { name: 'Server', value: 'server' }
                )
        ),
    execute(client, interaction, distube) {
        const adminTF = adminCheck(interaction);
        const commands = client.commands;
        let commandClasses = [];
        let helpMessageCommands = [];

        if (adminTF) {
            commands.forEach((cmd) => { if (!commandClasses.includes(capitalize(cmd.class)) && capitalize(cmd.class) != 'Devonly') { commandClasses.push(capitalize(cmd.class))} });
        } else {
            commands.forEach((cmd) => { if (!commandClasses.includes(capitalize(cmd.class)) && capitalize(cmd.class) != 'Devonly' && capitalize(cmd.class) != 'Admin') { commandClasses.push(capitalize(cmd.class))} });
        }

        commandClasses.sort();

        if (interaction.options.getString("helppage") == undefined || interaction.options.getString("helppage") == 'help') {
            commands.forEach((cmd) => { if (cmd.class == 'help') { helpMessageCommands.push(cmd) } });
            title = 'Help';
            return makeHelpMsg(interaction, title, helpMessageCommands, commandClasses, adminTF);
        } else if (commandClasses.includes(capitalize(interaction.options.getString("helppage"))) || interaction.options.getString("helppage") == 'all' || interaction.options.getString("helppage") == 'dm' || interaction.options.getString("helppage") == 'server') {
            switch (interaction.options.getString("helppage")) {
                case "admin":
                    if (adminTF) {
                        commands.forEach((cmd) => { if (cmd.class == interaction.options.getString("helppage")) { helpMessageCommands.push(cmd) } });
                        title = `${capitalize(interaction.options.getString("helppage"))} Help`;
                        makeHelpMsg(interaction, title, helpMessageCommands, commandClasses, adminTF);
                    } else {
                        errorNoAdmin(interaction, module.name);
                    }

                break;

                case "all":
                    for (c = 0; c < commandClasses.length; c++) {
                        helpMessageCommands = [];
                        commands.forEach((cmd) => { if (cmd.class == commandClasses[c].toLowerCase() && cmd.name != 'devsend') { helpMessageCommands.push(cmd) }});

                        if (commandClasses[c].toLowerCase() != 'help'){
                            title = `${capitalize(commandClasses[c])} Help`;
                        } else {
                            title = 'Help';
                        }

                        makeHelpMsg(interaction, title, helpMessageCommands, commandClasses, adminTF);
                    }

                break;

                case "dm":
                    commandClasses = commandClasses.filter(i => i.toLowerCase() != 'music');

                    for (c = 0; c < commandClasses.length; c++) {
                        helpMessageCommands = [];
                        commands.forEach((cmd) => { if (cmd.class == commandClasses[c].toLowerCase() && cmd.type.includes('DM') && cmd.name != 'devsend') { helpMessageCommands.push(cmd) }});

                        if (commandClasses[c].toLowerCase() != 'help'){
                            title = `${capitalize(commandClasses[c])} Help`;
                        } else {
                            title = 'Help';
                        }

                        makeHelpMsg(interaction, title, helpMessageCommands, commandClasses, adminTF);
                    }

                break;
            
                case "server":
                    for (c = 0; c < commandClasses.length; c++) {
                        helpMessageCommands = [];
                        commands.forEach((cmd) => { if (cmd.class == commandClasses[c].toLowerCase() && cmd.type.includes('Guild') && cmd.name != 'devsend') { helpMessageCommands.push(cmd) }});

                        if (commandClasses[c].toLowerCase() != 'help'){
                            title = `${capitalize(commandClasses[c])} Help`;
                        } else {
                            title = 'Help';
                        }

                        makeHelpMsg(interaction, title, helpMessageCommands, commandClasses, adminTF);
                    }

                break;

                default:
                    commands.forEach((cmd) => { if (cmd.class == interaction.options.getString("helppage") && cmd.name != 'devsend') { helpMessageCommands.push(cmd) } });
                    title = `${capitalize(interaction.options.getString("helppage"))} Help`;

                    makeHelpMsg(interaction, title, helpMessageCommands, commandClasses, adminTF);
                    
                break;
            }
        } else {
            return warnCustom(interaction, `The **${interaction.options.getString("helppage")}** page you requested does not exit. Please select from these pages: \`${makeCommandPageList(commandClasses)}\``, module.name);
        }
    }
}
//#endregion

//#region Function to create help message
function makeHelpMsg(interaction, title, helpMessageCommands, commandClasses, adminTF) {
    var helpMsg = '';
    commandClasses.sort();

    for (i = 0; i < helpMessageCommands.length; i++) {
        let key = helpMessageCommands[i];
        let aliasesLength = key.aliases.length;

        if (aliasesLength == 0) {
            helpMsg += `${key.usage} - Aliases: None - ${key.description}`
        } else if (aliasesLength == 1) {
            helpMsg += `${key.usage} - Aliases: ${key.aliases[0]} - ${key.description}`
        } else {
            let aliasList = '';
            for (a = 0; a < aliasesLength; a++) {
                if (a != (aliasesLength - 1)) {
                    aliasList += `${key.aliases[a]}, `;
                }
                else {
                    aliasList += key.aliases[a];
                }
            }
            helpMsg += `${key.usage} - Aliases: ${aliasList} - ${key.description}`
        }
        
        if (i != (helpMessageCommands.length - 1)) {
            helpMsg += `\n\n`;
        }
    };

    var pageList = makeCommandPageList(commandClasses);

    if (adminTF) {
        embedHelp(interaction, title, `\`Help Pages: ${pageList}\`\n**NOTE: !help Admin can only be run in a server!!!\n\n\n${helpMsg}`, client);
    } else {
        embedHelp(interaction, title, `\`Help Pages: ${pageList}\`\n${helpMsg}`, client);
    }
}
//#endregion

//#region Function to make list of command pages based off of their classes
function makeCommandPageList(commandClasses) {
    var pageList = '';

    for (i = 0; i < commandClasses.length; i++) {
        pageList += `${commandClasses[i]}, `;
    }

    pageList += `DM, Server, and All.`
    
    return pageList;
}
//#endregion
