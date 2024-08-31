//#region Dependencies
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { readFileSync, writeFileSync } = require('fs');
//#endregion
//#region Data Files
var prefixFile = JSON.parse(readFileSync('././data/botPrefix.json'));
//#endregion
//#region Helpers
const { errorNoAdmin, warnCustom, embedCustom, errorCustom, } = require('../../helpers/embedSlashMessages.js');
const { adminCheck } = require('../../helpers/userPermissions.js');
//#endregion
//Regex that should eliminate anything that is not ~!$%^&*()_+-={}[]|:";'<>?,.
const isSymbol = /[~!$%^&*()_+\-={}[\]\|:";'<>?,.]/;
//#region This exports the changeprefix command with the information about it
module.exports = {
    data: new SlashCommandBuilder()
        .setName('changeprefix')
        .setDescription('Changes the prefix the bot uses in your server.')
        .addStringOption((option) => option
        .setName('symbol')
        .setDescription('Use one of the following symbols: ~!$%^&*()_+-=[];\',.{}|:"<>?')
        .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    execute(client, interaction, distube) {
        var serverID = interaction.guild.id;
        if (adminCheck(interaction)) {
            if (interaction.options.getString('symbol') != undefined) {
                if (interaction.options.getString('symbol').length == 1 &&
                    isSymbol.test(interaction.options.getString('symbol'))) {
                    prefixFile[serverID] = {
                        prefix: interaction.options.getString('symbol'),
                    };
                    writeFileSync('././data/botPrefix.json', JSON.stringify(prefixFile), (err) => {
                        if (err) {
                            return errorCustom(interaction, err.description, module.name, client);
                        }
                    });
                    return embedCustom(interaction, 'Current Prefix:', '#008000', `Current Prefix is ${interaction.options.getString('symbol')}`, {
                        text: `Requested by ${interaction.user.username}`,
                        iconURL: null,
                    }, null, [], null, null);
                }
                else {
                    return warnCustom(interaction, 'Bot Prefix Must be ONE of the following: ```~!$%^&*()_+-={}[]|:";\'<>?,./```', module.name, client);
                }
            }
            else {
                return warnCustom(interaction, 'You must define a bot prefix.', module.name, client);
            }
        }
        else {
            return errorNoAdmin(interaction, module.name, client);
        }
    },
};
export {};
//#endregion
