var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//#region Dependencies
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
//#endregion
//#region Helpers
const { embedCustom, warnDisabled, warnCustom, } = require('../../helpers/embedSlashMessages.js');
const { updateConfigFile } = require('../../helpers/currentSettings.js');
//#endregion
//#region This exports the blame command with the information about it
module.exports = {
    data: new SlashCommandBuilder()
        .setName('blame')
        .setDescription('Blames someone based on a weekly rotation/permanent blame list.'),
    execute(client, interaction, distube) {
        return __awaiter(this, void 0, void 0, function* () {
            var serverID = interaction.guildId;
            //Gets current config file
            var serverConfig = updateConfigFile();
            if (serverConfig[serverID].blame.enable) {
                //Blames a person
                var blameList = [];
                for (key in serverConfig[serverID].blame.permList) {
                    blameList.push(serverConfig[serverID].blame.permList[key]);
                }
                var blameString = '';
                if (serverConfig[serverID].blame.rotateList.length > 0) {
                    var rotateIndex = Math.floor((Date.now() - 493200000) / 604800000) -
                        Math.floor(Math.floor((Date.now() - 493200000) / 604800000) /
                            serverConfig[serverID].blame.rotateList.length) *
                            serverConfig[serverID].blame.rotateList.length -
                        serverConfig[serverID].blame.offset;
                    if (rotateIndex >=
                        serverConfig[serverID].blame.rotateList.length) {
                        rotateIndex -=
                            serverConfig[serverID].blame.rotateList.length;
                    }
                    else if (rotateIndex < 0) {
                        rotateIndex +=
                            serverConfig[serverID].blame.rotateList.length;
                    }
                    blameList.push(serverConfig[serverID].blame.rotateList[rotateIndex]);
                }
                else if (blameList.length < 1) {
                    return warnCustom(interaction, 'The blame list is empty!', module.name, client);
                }
                if (blameList.length == 1) {
                    if (serverConfig[serverID].blame.cursing) {
                        embedCustom(interaction, 'Blame', '#B54A65', `It's ${blameList[0]}'s fault fuck that guy in particular!`, {
                            text: `Requested by ${interaction.user.username}`,
                            iconURL: null,
                        }, null, [], null, null);
                    }
                    else {
                        embedCustom(interaction, 'Blame', '#B54A65', `It's ${blameList[0]}'s fault screw that guy in particular!`, {
                            text: `Requested by ${interaction.user.username}`,
                            iconURL: null,
                        }, null, [], null, null);
                    }
                }
                else {
                    for (key in blameList) {
                        if (blameList.length > 2) {
                            if (key == blameList.length - 1) {
                                blameString += `and ${blameList[key]}'s`;
                            }
                            else {
                                blameString += `${blameList[key]}, `;
                            }
                        }
                        else {
                            if (key == blameList.length - 1) {
                                blameString += `and ${blameList[key]}'s`;
                            }
                            else {
                                blameString += `${blameList[key]} `;
                            }
                        }
                    }
                    if (serverConfig[serverID].blame.cursing) {
                        embedCustom(interaction, 'Blame', '#B54A65', `It's ${blameString} fault fuck those guys in particular!`, {
                            text: `Requested by ${interaction.user.username}`,
                            iconURL: null,
                        }, null, [], null, null);
                    }
                    else {
                        embedCustom(interaction, 'Blame', '#B54A65', `It's ${blameString} fault screw those guys in particular!`, {
                            text: `Requested by ${interaction.user.username}`,
                            iconURL: null,
                        }, null, [], null, null);
                    }
                }
            }
            else {
                warnDisabled(interaction, 'blame', module.name, client);
            }
        });
    },
};
export {};
//#endregion
