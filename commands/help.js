//#region Helpers
const { embedHelp, warnCustom, errorNoAdmin} = require('../helpers/embedMessages.js');
const { adminCheck } = require('../helpers/userHandling.js');
const { capitalize } = require('../helpers/stringHelpers.js');
//#endregion

//#region This exports the help command with the information about it
module.exports = {
    name: 'help',
    type: ['DM', 'Guild'],
    cooldown: 0,
    aliases: ['h'],
    class: 'help',
    usage: 'help ***PAGE***',
    description: "Displays Help Message, specifying a page will show that help info, using the **\"All\"** page will display all commands, the **\"DM\"** page will display all commands that can be Direct Messaged to the bot, and the **\"Server\"** page will display all commands that can be used in a discord server.",
    execute(message, args) {
        var args = args.map(v => v.toLowerCase());
        const adminTF = adminCheck(message);
        const commands = message.client.commands.array();
        let commandClasses = [];
        let helpMessageCommands = [];
        if (adminTF) {
            commands.forEach((cmd) => { if (!commandClasses.includes(capitalize(cmd.class))) { commandClasses.push(capitalize(cmd.class))} });
        }
        else {
            commands.forEach((cmd) => { if (!commandClasses.includes(capitalize(cmd.class)) && capitalize(cmd.class) != 'Admin') { commandClasses.push(capitalize(cmd.class))} });
        }

        commandClasses.sort();

        if (args[0] == undefined || args[0] == 'help') {
            commands.forEach((cmd) => { if (cmd.class == 'help' && cmd.name != 'devsend') { helpMessageCommands.push(cmd) } });
            title = 'Help';
            makeHelpMsg(message, title, helpMessageCommands, commandClasses);
            
            if (message.channel.guild != undefined) {
                message.delete({ timeout: 1500, reason: 'Cleanup.' });
            }
            
            return;
        }
        else if (commandClasses.includes(toLowerCase(args[0])) || args[0] == 'all' || args[0] == 'dm' || args[0] == 'server') {
            if (args[0] == 'admin') {
                if (adminTF) {
                    commands.forEach((cmd) => { if (cmd.class == args[0] && cmd.name != 'devsend') { helpMessageCommands.push(cmd) } });
                    title = `${capitalize(args[0])} Help`;
                }
                else {
                    errorNoAdmin(message, module.name);
                    return;
                }
            }
            else if (args[0] == 'all') {
                for (c = 0; c < commandClasses.length; c++) {
                    helpMessageCommands = [];
                    commands.forEach((cmd) => { if (cmd.class == commandClasses[c].toLowerCase() && cmd.name != 'devsend') { helpMessageCommands.push(cmd) }});

                    if (commandClasses[c].toLowerCase() != 'help'){
                        title = `${capitalize(commandClasses[c])} Help`;
                    }
                    else {
                        title = 'Help';
                    }

                    makeHelpMsg(message, title, helpMessageCommands, commandClasses);
                }

                return;
            }
            else if (args[0] == 'dm') {
                commandClasses = commandClasses.filter(i => i.toLowerCase() != 'music');

                for (c = 0; c < commandClasses.length; c++) {
                    helpMessageCommands = [];
                    commands.forEach((cmd) => { if (cmd.class == commandClasses[c].toLowerCase() && cmd.type.includes('DM') && cmd.name != 'devsend') { helpMessageCommands.push(cmd) }});

                    if (commandClasses[c].toLowerCase() != 'help'){
                        title = `${capitalize(commandClasses[c])} Help`;
                    }
                    else {
                        title = 'Help';
                    }

                    makeHelpMsg(message, title, helpMessageCommands, commandClasses);
                }

                return;
            }
            else if (args[0] == 'server') {
                for (c = 0; c < commandClasses.length; c++) {
                    helpMessageCommands = [];
                    commands.forEach((cmd) => { if (cmd.class == commandClasses[c].toLowerCase() && cmd.type.includes('Guild') && cmd.name != 'devsend') { helpMessageCommands.push(cmd) }});

                    if (commandClasses[c].toLowerCase() != 'help'){
                        title = `${capitalize(commandClasses[c])} Help`;
                    }
                    else {
                        title = 'Help';
                    }

                    makeHelpMsg(message, title, helpMessageCommands, commandClasses);
                }
            }
            else {
                commands.forEach((cmd) => { if (cmd.class == args[0] && cmd.name != 'devsend') { helpMessageCommands.push(cmd) } });
                title = `${capitalize(args[0])} Help`;

                makeHelpMsg(message, title, helpMessageCommands, commandClasses);
            }

            if (message.channel.guild != undefined) {
                message.delete({ timeout: 1500, reason: 'Cleanup.' });
            }
            
            return;
        }
        else {
            warnCustom(message, `The **${args[0]}** page you requested does not exit. Please select from these pages: \`**${makeCommandPageList(commandClasses)}**\``, module.name);
            
            if (message.channel.guild != undefined) {
                message.delete({ timeout: 15000, reason: 'Cleanup.' });
            }
            
            return;
        }
    }
}
//#endregion

//#region Function to create help message
function makeHelpMsg(message, title, helpMessageCommands, commandClasses) {
    var helpMsg = '';
    commandClasses.sort();

    for (i = 0; i < helpMessageCommands.length; i++) {
        let key = helpMessageCommands[i];
        let aliasesLength = key.aliases.length;

        if (aliasesLength == 0) {
            helpMsg += `${key.usage} - Aliases: None - ${key.description}`
        }
        else if (aliasesLength == 1) {
            helpMsg += `${key.usage} - Aliases: ${key.aliases[0]} - ${key.description}`
        }
        else {
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

    embedHelp(message, title, `\`Help Pages: ${pageList}\`\n${helpMsg}`);
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
