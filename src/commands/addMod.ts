//#region Imports
import { PermissionFlagsBits } from 'discord.js';
import { errorNoServerAdmin, errorCustom, warnCustom, embedCustom } from '../helpers/embedMessages.js';
import { buildConfigFile } from '../internal/settingsFunctions.js';
import { Command } from '../models/commandModel.js';
//#endregion

//#region This creates the addmod command with the information about it
const addModCommand: Command = {
    name: 'addmod',
    type: ['Guild'],
    aliases: [''],
    coolDown: 0,
    class: 'admin',
    usage: 'addmod ***MENTION-USERS***',
    description: 'Adds users to the list of people that get the PM when someone whispers the bot with the modmail command. MUST HAVE SERVER ADMINISTRATOR STATUS.',
    async execute(message, args, client, distube, collections, serverConfig) {
        const channel = message.channel;

        //This is to make sure the channel has a guild
        if (channel.isDMBased()) {
            return;
        }

        if (message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            if (channel.guild.id in serverConfig) {
                if (message.mentions.members.size == 0) {
                    return warnCustom(message, 'No user input detected, Did you make sure to @ them?', this.name);
                }

                message.mentions.members.forEach(async (user) => {
                    var serverID = channel.guild.id;
                    var array = serverConfig.modMail.modList;
                    var userFound = false;

                    array.forEach((item) => {
                        if (item == user.id) {
                            userFound = true;
                        }
                    });

                    if (!userFound) {
                        array.push(user.id);
                    } else {
                        return warnCustom(message, `User ${user.user.username} is already a Mod!`, this.name);
                    }

                    var modMail = {
                        enable: false,
                        modList: [],
                    };
                    modMail.modList = array;
                    modMail.enable = true;
                    serverConfig.modMail = modMail;

                    await buildConfigFile(serverConfig, serverID);

                    embedCustom(
                        message,
                        'Mods Added',
                        '#5D3FD3',
                        `Mod ${user.user} has been successfully added!`,
                        {
                            text: `Requested by ${message.author.tag}`,
                            iconURL: null,
                        },
                        null,
                        [],
                        null,
                        null
                    );
                });
            } else {
                return errorCustom(message, 'Server is not set up with the bot yet!', this.name, client);
            }
        } else {
            return errorNoServerAdmin(message, this.name);
        }
    },
};
//#endregion

//#region Exports
export default addModCommand;
//#endregion
