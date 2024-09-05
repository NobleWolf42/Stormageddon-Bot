//#region Imports
import { PermissionFlagsBits } from 'discord.js';
import { errorNoServerAdmin, warnCustom, embedCustom } from '../helpers/embedMessages.js';
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
    async execute(message, _args, _client, _distube, _collections, serverConfig) {
        const channel = message.channel;

        //#region Escape Conditionals
        //This checks that the channel is in a guild
        if (channel.isDMBased()) {
            return;
        }

        //This checks the user for discord admin privileges in the server
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            errorNoServerAdmin(message, this.name);
            return;
        }

        //This checks to make sure there is valid user input
        if (message.mentions.members.size == 0) {
            warnCustom(message, 'No user input detected, Did you make sure to @ them?', this.name);
            return;
        }
        //#endregion

        //#region Main Logic - Adds users to the mod list
        for (const [_, user] of message.mentions.members) {
            const serverID = channel.guild.id;
            const userFound = serverConfig.modMail.modList.find((test) => test == user.id);

            //This Escape Logic prevents duplicating mods
            if (userFound) {
                warnCustom(message, `User ${user.user} is already a Mod!`, this.name);
                return;
            }

            const modMail: { enable: boolean; modList: string[] } = {
                enable: true,
                modList: serverConfig.modMail.modList,
            };

            modMail.modList.push(user.id);
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
        }
        //#endregion
    },
};
//#endregion

//#region Exports
export default addModCommand;
//#endregion
