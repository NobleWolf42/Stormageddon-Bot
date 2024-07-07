//#region Dependencies
const { SlashCommandBuilder } = require('discord.js');
const { XMLHttpRequest } = require("xmlhttprequest");
//#endregion

//#region Data Files
const config = require('../../data/botConfig.json');
//#endregion

//#region Helpers
const { embedCustom, warnCustom, errorCustom } = require('../../helpers/embedSlashMessages.js');
//#endregion

//#region This exports the destiny2 command with the information about it
module.exports = {
    data: new SlashCommandBuilder()
        .setName("destiny2")
        .setDescription("Displays information from Destiny 2 servers.")
        .addSubcommand(subcommand =>
            subcommand
                .setName("clan")
                .setDescription("Displays Destiny 2 clan's bio, avatar, motto, and founder")
                .addStringOption(option =>
                    option.setName('clanname')
                        .setDescription('Name of clan you want to see information on.')
                        .setRequired(true)
                )
        ),
    execute(client, interaction, distube) {
        if (interaction.options.getSubcommand() == 'clan') {
            var clanName = interaction.options.getString("clanname");
            getClan(interaction, clanName);
        } else {
            warnCustom(interaction, "You did not use the command correctly, please try again.", module.name, client);
        }

    }
}
//#endregion

//#region Gets the information of the destiny 2 clan by name
function getClan(interaction, clan_name){
    // Request initialized and created
    var request = new XMLHttpRequest()
    request.open('GET', 'https://www.bungie.net/Platform/GroupV2/Name/'+clan_name+'/1', true);
    request.setRequestHeader('X-API-KEY', config.auth.d2ApiKey);
    request.onload = function() {
        // After request is received, parse it.
        var data = JSON.parse(request.responseText)["Response"];
        var error = JSON.parse(request.responseText);

        if (request.status >= 200 && request.status < 400) {
            if (data != null && data != undefined) {
                var domain = "https://www.bungie.net/";

                var attachment = (domain + data["founder"]["bungieNetUserInfo"]["iconPath"]);
                return embedCustom(interaction, `${clan_name} Clan Information`, '#F5F5F5', `The clan was created on ${data["detail"]["creationDate"]}.\n The founder is ${data["founder"]["bungieNetUserInfo"]["displayName"]}.\n\n ${data["detail"]["about"]}`, { text: `Requested by ${interaction.user.username}`, iconURL: null }, attachment, [], null, null);
            }
            else {
                return warnCustom(interaction, `The Search for \`${clan_name}\` returned no results.\n Try something else.`, module.name, client);
            }
        }
        else if (error.ErrorStatus == 'ClanNotFound') {
            return warnCustom(interaction, `The Search for \`${clan_name}\` returned no results.\n Try something else.`, module.name, client);
        }
        else {
            return errorCustom(interaction, "The Destiny API was unable to be reached at this time.\n Try again later.", module.name, client);
        }
    }

    request.send()
}
//#endregion
