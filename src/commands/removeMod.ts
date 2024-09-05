//#region Imports
import { PermissionFlagsBits } from 'discord.js';
import { errorNoServerAdmin, errorCustom, embedCustom, warnCustom } from '../helpers/embedMessages.js';
import { buildConfigFile } from '../internal/settingsFunctions.js';
import { Command } from '../models/commandModel.js';
//#endregion

//#region This exports the removemod command with the information about it
const removeModCommand: Command = {
    name: 'removemod',
    type: ['Guild'],
    aliases: [''],
    coolDown: 0,
    class: 'admin',
    usage: 'removemod ***MENTION-USERS***',
    description: 'Removes users from the list of people that get the PM when someone whispers the bot with the !modmail command. MUST HAVE SERVER ADMINISTRATOR STATUS.',
    async execute(message, _args, _client, _distube, _collections, serverConfig) {
        const channel = message.channel;

        //#region Escape Conditionals
        if (channel.isDMBased()) {
            return;
        }

        if (message.mentions.members.size == 0) {
            return warnCustom(message, 'No user input detected, Did you make sure to @ them?', this.name);
        }

        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return errorNoServerAdmin(message, this.name);
        }
        //#endregion

        //#region Main Logic
        for (const [_, user] of message.mentions.members) {
            const serverID = channel.guild.id;
            const userFound = serverConfig.modMail.modList.find((test) => test == user.id);

            if (!userFound) {
                return warnCustom(message, `User ${user.user} is not a Mod!`, this.name);
            }

            const modList = serverConfig.modMail.modList.filter(function (value) {
                return value != user.id;
            });

            const modMail: { enable: boolean; modList: string[] } = {
                enable: true,
                modList: modList,
            };

            serverConfig.modMail = modMail;

            await buildConfigFile(serverConfig, serverID);

            embedCustom(
                message,
                'Mods Removed',
                '#5D3FD3',
                `Mods have been successfully removed!`,
                {
                    text: `Requested by ${message.author.tag}`,
                    iconURL: null,
                },
                null,
                [],
                null,
                null
            );
        }
        //#endregion
    },
};
//#endregion

//#region Exports
export default removeModCommand;
//#endregion
