var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//#region Helpers
import { PermissionFlagsBits } from 'discord.js';
import { errorNoServerAdmin, errorCustom, warnCustom, embedCustom } from '../helpers/embedMessages';
//##endregion
//#region Internals
import { buildConfigFile } from '../internal/settingsFunctions';
//#endregion
//#region Modules
import { MongooseServerConfig } from '../models/serverConfig';
//#endregion
//#region This exports the addmod command with the information about it
module.exports = {
    name: 'addmod',
    type: ['Guild'],
    aliases: [''],
    coolDown: 0,
    class: 'admin',
    usage: 'addmod ***MENTION-USERS***',
    description: 'Adds users to the list of people that get the PM when someone whispers the bot with the modmail command. MUST HAVE SERVER ADMINISTRATOR STATUS.',
    execute(message, args, client, distube) {
        return __awaiter(this, void 0, void 0, function* () {
            //Gets serverConfig from database
            var serverConfig = (yield MongooseServerConfig.findById(message.channel.guild.id).exec()).toObject();
            if (message.member.permissions.has(PermissionFlagsBits.Administrator)) {
                if (message.channel.guild.id in serverConfig) {
                    if (message.mentions.members.size == 0) {
                        return warnCustom(message, 'No user input detected, Did you make sure to @ them?', this.name);
                    }
                    message.mentions.members.forEach((user) => __awaiter(this, void 0, void 0, function* () {
                        var serverID = message.channel.guild.id;
                        var array = serverConfig.modMail.modList;
                        var userFound = false;
                        array.forEach((item) => {
                            if (item == user) {
                                userFound = true;
                            }
                        });
                        if (!userFound) {
                            array.push(user.id);
                        }
                        else {
                            return warnCustom(message, `User ${user.tag} is already a Mod!`, this.name);
                        }
                        var modMail = {
                            enable: false,
                            modList: [],
                        };
                        modMail.modList = array;
                        modMail.enable = true;
                        serverConfig.modMail = modMail;
                        yield buildConfigFile(serverConfig, serverID);
                        embedCustom(message, 'Mods Added', '#5D3FD3', `Mod ${user.tag} has been successfully added!`, {
                            text: `Requested by ${message.author.tag}`,
                            iconURL: null,
                        }, null, [], null, null);
                    }));
                }
                else {
                    return errorCustom(message, 'Server is not set up with the bot yet!', this.name, client);
                }
            }
            else {
                return errorNoServerAdmin(message, this.name);
            }
        });
    },
};
//#endregion
