//#region Dependencies
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
//#endregion

//#region Helpers
const { embedCustom, warnDisabled, warnCustom } = require('../../helpers/embedSlashMessages.js');
const { updateConfigFile } = require('../../helpers/currentSettings.js');
//#endregion

//#region This exports the blame command with the information about it
module.exports = {
    data: new SlashCommandBuilder()
        .setName("blame")
        .setDescription("Blames someone based on a weekly rotation/permanent blame list."),
        async execute(client, interaction, distube) {
        var serverID = interaction.guildId;

        //Gets current config file
        var serverConfig = updateConfigFile();

        if (serverConfig[serverID].blame.enable) {
            //Blames a person
            var blameList = [];

            for (key in serverConfig[serverID].blame.permList) {
                blameList.push(serverConfig[serverID].blame.permList[key]);
            }

            var blameString = "";
            if (serverConfig[serverID].blame.rotateList.length > 0) {
                blameList.push(serverConfig[serverID].blame.rotateList[Math.floor((Date.now() - 493200000) / 604800000) - (Math.floor(Math.floor((Date.now() - 493200000) / 604800000) / serverConfig[serverID].blame.rotateList.length) * serverConfig[serverID].blame.rotateList.length) - serverConfig[serverID].blame.offset]);
            } else if (blameList.length < 1) {
                return warnCustom(interaction, "The blame list is empty!", module.name, client);
            }

            if (blameList.length == 1) {
                if (serverConfig[serverID].blame.cursing) {
                    embedCustom(interaction, "Blame", "#B54A65", `It's ${blameList[0]}'s fault fuck that guy in particular!`, { text: `Requested by ${interaction.user.username}`, iconURL: null }, null, [], null, null);
                } else {
                    embedCustom(interaction, "Blame", "#B54A65", `It's ${blameList[0]}'s fault screw that guy in particular!`, { text: `Requested by ${interaction.user.username}`, iconURL: null }, null, [], null, null);
                }
            } else {
                for (key in blameList) {
                    if (blameList.length > 2) {
                        if (key == blameList.length - 1) {
                            blameString += `and ${blameList[key]}'s`;
                        } else {
                            blameString += `${blameList[key]}, `;
                        }
                    } else {
                        if (key == blameList.length - 1) {
                            blameString += `and ${blameList[key]}'s`;
                        } else {
                            blameString += `${blameList[key]} `;
                        }
                    }
                }
                if (serverConfig[serverID].blame.cursing) {
                    embedCustom(interaction, "Blame", "#B54A65", `It's ${blameString} fault fuck those guys in particular!`, { text: `Requested by ${interaction.user.username}`, iconURL: null }, null, [], null, null);
                } else {
                    embedCustom(interaction, "Blame", "#B54A65", `It's ${blameString} fault screw those guys in particular!`, { text: `Requested by ${interaction.user.username}`, iconURL: null }, null, [], null, null);
                }
            }
        } else {
            warnDisabled(interaction, "blame", module.name, client);
        }
    }
}
//#endregion
