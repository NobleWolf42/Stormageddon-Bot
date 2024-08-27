//#region Dependencies
var SlashCommandBuilder = require('discord.js').SlashCommandBuilder;
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
//#endregion
//#region Helpers
var _a = require('../../helpers/embedSlashMessages.js'), embedCustom = _a.embedCustom, warnCustom = _a.warnCustom, errorCustom = _a.errorCustom;
//#endregion
//#region This exports the destiny2 command with the information about it
module.exports = {
    data: new SlashCommandBuilder()
        .setName('destiny2')
        .setDescription('Displays information from Destiny 2 servers.')
        .addSubcommand(function (subcommand) {
        return subcommand
            .setName('clan')
            .setDescription("Displays Destiny 2 clan's bio, avatar, motto, and founder")
            .addStringOption(function (option) {
            return option
                .setName('clanname')
                .setDescription('Name of clan you want to see information on.')
                .setRequired(true);
        });
    }),
    execute: function (client, interaction, distube) {
        if (interaction.options.getSubcommand() == 'clan') {
            var clanName = interaction.options.getString('clanname');
            getClan(interaction, clanName, client);
        }
        else {
            warnCustom(interaction, 'You did not use the command correctly, please try again.', module.name, client);
        }
    },
};
//#endregion
//#region Gets the information of the destiny 2 clan by name
function getClan(interaction, clan_name, client) {
    // Request initialized and created
    var request = new XMLHttpRequest();
    request.open('GET', 'https://www.bungie.net/Platform/GroupV2/Name/' + clan_name + '/1', true);
    request.setRequestHeader('X-API-KEY', process.env.d2ApiKey);
    request.onload = function () {
        // After request is received, parse it.
        var data = JSON.parse(request.responseText)['Response'];
        var error = JSON.parse(request.responseText);
        if (request.status >= 200 && request.status < 400) {
            if (data != null && data != undefined) {
                var domain = 'https://www.bungie.net/';
                var attachment = domain + data['founder']['bungieNetUserInfo']['iconPath'];
                return embedCustom(interaction, "".concat(clan_name, " Clan Information"), '#F5F5F5', "The clan was created on ".concat(data['detail']['creationDate'], ".\n The founder is ").concat(data['founder']['bungieNetUserInfo']['displayName'], ".\n\n ").concat(data['detail']['about']), {
                    text: "Requested by ".concat(interaction.user.username),
                    iconURL: null,
                }, attachment, [], null, null);
            }
            else {
                return warnCustom(interaction, "The Search for `".concat(clan_name, "` returned no results.\n Try something else."), module.name, client);
            }
        }
        else if (error.ErrorStatus == 'ClanNotFound') {
            return warnCustom(interaction, "The Search for `".concat(clan_name, "` returned no results.\n Try something else."), module.name, client);
        }
        else {
            return errorCustom(interaction, 'The Destiny API was unable to be reached at this time.\n Try again later.', module.name, client);
        }
    };
    request.send();
}
//#endregion
