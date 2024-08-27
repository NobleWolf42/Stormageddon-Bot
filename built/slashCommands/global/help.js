//#region Dependencies
var SlashCommandBuilder = require('discord.js').SlashCommandBuilder;
//#endregion
//#region Helpers
var _a = require('../../helpers/embedSlashMessages.js'), embedHelp = _a.embedHelp, warnCustom = _a.warnCustom, errorNoAdmin = _a.errorNoAdmin;
var adminCheck = require('../../helpers/userPermissions.js').adminCheck;
var capitalize = require('../../helpers/stringHelpers.js').capitalize;
//#endregion
//#region This exports the help command with the information about it
module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays Help Message.')
        .addStringOption(function (option) {
        return option
            .setName('helppage')
            .setDescription('Select a help page (admin/direct/fun/gaming/help/music).')
            .setRequired(false)
            .setChoices({ name: 'Admin', value: 'admin' }, { name: 'Direct', value: 'direct' }, { name: 'Fun', value: 'fun' }, { name: 'Gaming', value: 'gaming' }, { name: 'Help', value: 'help' }, { name: 'Music', value: 'music' });
    }),
    execute: function (client, interaction, distube) {
        var adminTF = adminCheck(interaction);
        var commands = client.commands;
        var commandClasses = [];
        var helpMessageCommands = [];
        //Checks to see if your an admin and only adds the admin page to the commandClasses array if you are
        if (process.env.devIDs.includes(interaction.author.id)) {
            commands.forEach(function (cmd) {
                if (!commandClasses.includes(capitalize(cmd.class))) {
                    commandClasses.push(capitalize(cmd.class));
                }
            });
        }
        else if (adminTF) {
            commands.forEach(function (cmd) {
                if (!commandClasses.includes(capitalize(cmd.class)) &&
                    capitalize(cmd.class) != 'Developer') {
                    commandClasses.push(capitalize(cmd.class));
                }
            });
        }
        else {
            commands.forEach(function (cmd) {
                if (!commandClasses.includes(capitalize(cmd.class)) &&
                    capitalize(cmd.class) != 'Developer' &&
                    capitalize(cmd.class) != 'Admin') {
                    commandClasses.push(capitalize(cmd.class));
                }
            });
        }
        //Makes the commandClasses array alphabetical
        commandClasses.sort();
        //Outputs the default help page if no page or help page is detected, otherwise handles it in the switch statement
        if (interaction.options.getString('helppage') == undefined ||
            interaction.options.getString('helppage') == 'help') {
            commands.forEach(function (cmd) {
                if (cmd.class == 'help') {
                    helpMessageCommands.push(cmd);
                }
            });
            title = 'Help';
            return makeHelpMsg(interaction, title, helpMessageCommands, commandClasses, adminTF, client);
        }
        else if (commandClasses.includes(capitalize(interaction.options.getString('helppage'))) ||
            interaction.options.getString('helppage') == 'all' ||
            interaction.options.getString('helppage') == 'dm' ||
            interaction.options.getString('helppage') == 'server') {
            //Switch case to output help page based on requested page
            switch (interaction.options.getString('helppage')) {
                //Outputs admin page if user is admin in the server its run in, otherwise sends an error message
                case 'admin':
                    if (adminTF) {
                        commands.forEach(function (cmd) {
                            if (cmd.class ==
                                interaction.options.getString('helppage')) {
                                helpMessageCommands.push(cmd);
                            }
                        });
                        title = "".concat(capitalize(interaction.options.getString('helppage')), " Help");
                        makeHelpMsg(interaction, title, helpMessageCommands, commandClasses, adminTF, client);
                    }
                    else {
                        errorNoAdmin(interaction, module.name, client);
                    }
                    break;
                //Outputs developer page if user is a dev, otherwise sends an error message
                case 'developer':
                    if (process.env.devIDs.includes(interaction.author.id)) {
                        commands.forEach(function (cmd) {
                            if (cmd.class == args[0]) {
                                helpMessageCommands.push(cmd);
                            }
                        });
                        title = "".concat(capitalize(args[0]), " Help");
                        makeHelpMsg(interaction, title, helpMessageCommands, commandClasses, adminTF);
                    }
                    else {
                        return warnCustom(interaction, "The **".concat(args[0], "** page you requested does not exit. Please select from these pages: `").concat(makeCommandPageList(commandClasses), "`"), module.name);
                    }
                    break;
                //Outputs the commands for the chosen page
                default:
                    commands.forEach(function (cmd) {
                        if (cmd.class ==
                            interaction.options.getString('helppage') &&
                            cmd.name != 'devsend') {
                            helpMessageCommands.push(cmd);
                        }
                    });
                    title = "".concat(capitalize(interaction.options.getString('helppage')), " Help");
                    makeHelpMsg(interaction, title, helpMessageCommands, commandClasses, adminTF, client);
                    break;
            }
        }
        else {
            return warnCustom(interaction, "The **".concat(interaction.options.getString('helppage'), "** page you requested does not exit. Please select from these pages: `").concat(makeCommandPageList(commandClasses), "`"), module.name);
        }
    },
};
//#endregion
//#region Function to create help message
/**
 * This function makes the help message and send it
 * @param {Interaction} interaction Discord.js Interaction object
 * @param {string} title Title of the help page
 * @param {Array} helpMessageCommands Array containing the commands
 * @param {Array} commandClasses Array containing the class types of commands
 * @param {Boolean} adminTF Tre/False based on if the user is an admin
 * @param {Client} client Discord.js Client object
 */
function makeHelpMsg(interaction, title, helpMessageCommands, commandClasses, adminTF, client) {
    var helpMsg = '';
    commandClasses.sort();
    for (i = 0; i < helpMessageCommands.length; i++) {
        var key = helpMessageCommands[i];
        var aliasesLength = key.aliases.length;
        if (aliasesLength == 0) {
            helpMsg += "".concat(key.usage, " - Aliases: None - ").concat(key.description);
        }
        else if (aliasesLength == 1) {
            helpMsg += "".concat(key.usage, " - Aliases: ").concat(key.aliases[0], " - ").concat(key.description);
        }
        else {
            var aliasList = '';
            for (a = 0; a < aliasesLength; a++) {
                if (a != aliasesLength - 1) {
                    aliasList += "".concat(key.aliases[a], ", ");
                }
                else {
                    aliasList += key.aliases[a];
                }
            }
            helpMsg += "".concat(key.usage, " - Aliases: ").concat(aliasList, " - ").concat(key.description);
        }
        if (i != helpMessageCommands.length - 1) {
            helpMsg += "\n\n";
        }
    }
    var pageList = makeCommandPageList(commandClasses);
    if (adminTF) {
        embedHelp(interaction, title, "`Help Pages: ".concat(pageList, "`\n**NOTE: !help Admin can only be run in a server!!!\n\n\n").concat(helpMsg), client);
    }
    else {
        embedHelp(interaction, title, "`Help Pages: ".concat(pageList, "`\n").concat(helpMsg), client);
    }
}
//#endregion
//#region Function to make list of command pages based off of their classes
function makeCommandPageList(commandClasses) {
    var pageList = '';
    for (i = 0; i < commandClasses.length; i++) {
        pageList += "".concat(commandClasses[i], ", ");
    }
    return pageList;
}
//#endregion
