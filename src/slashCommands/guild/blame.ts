//#region Imports
import { SlashCommandBuilder, User } from 'discord.js';
import { embedCustom, warnDisabled, warnCustom } from '../../helpers/embedSlashMessages.js';
import { SlashCommand } from '../../models/slashCommandModel.js';
import { MongooseServerConfig } from '../../models/serverConfigModel.js';
//#endregion

//#region This exports the blame command with the information about it
const blameSlashCommand: SlashCommand = {
    data: new SlashCommandBuilder().setName('blame').setDescription('Blames someone based on a weekly rotation/permanent blame list.'),
    async execute(client, interaction) {
        //#region Escape Logic
        if (!interaction.isChatInputCommand()) {
            return;
        }

        const serverConfig = (await MongooseServerConfig.findById(interaction.guildId).exec()).toObject();

        if (!serverConfig.blame.enable) {
            warnDisabled(interaction, 'blame', blameSlashCommand.data.name);
        }
        //#endregion

        //Blames a person
        const blameList: string[] = [];

        for (const key of serverConfig.blame.permList) {
            blameList.push(key);
        }

        let blameString = '';
        if (serverConfig.blame.rotateList.length > 0) {
            let rotateIndex =
                Math.floor((Date.now() - 493200000) / 604800000) -
                Math.floor(Math.floor((Date.now() - 493200000) / 604800000) / serverConfig.blame.rotateList.length) * serverConfig.blame.rotateList.length -
                serverConfig.blame.offset;

            if (rotateIndex >= serverConfig.blame.rotateList.length) {
                rotateIndex -= serverConfig.blame.rotateList.length;
            } else if (rotateIndex < 0) {
                rotateIndex += serverConfig.blame.rotateList.length;
            }

            blameList.push(serverConfig.blame.rotateList[rotateIndex]);
        }

        if (blameList.length < 1) {
            warnCustom(interaction, 'The blame list is empty!', blameSlashCommand.data.name);
            return;
        }

        const blameUserList: User[] = [];

        for (const key of blameList) {
            let blameUser = client.users.cache.get(key);

            if (blameUser == undefined) {
                blameUser = await client.users.fetch(key);
            }

            blameUserList.push(blameUser);
        }

        if (blameList.length == 1) {
            if (serverConfig.blame.cursing) {
                embedCustom(
                    interaction,
                    'Blame',
                    '#B54A65',
                    `It's ${blameUserList[0]}'s fault fuck that guy in particular!`,
                    {
                        text: `Requested by ${interaction.user.tag}`,
                        iconURL: null,
                    },
                    null,
                    [],
                    null,
                    null
                );
            } else {
                embedCustom(
                    interaction,
                    'Blame',
                    '#B54A65',
                    `It's ${blameUserList[0]}'s fault screw that guy in particular!`,
                    {
                        text: `Requested by ${interaction.user.tag}`,
                        iconURL: null,
                    },
                    null,
                    [],
                    null,
                    null
                );
            }
        } else {
            for (const key in blameUserList) {
                if (blameUserList.length > 2) {
                    if (key == (blameUserList.length - 1).toString()) {
                        blameString += `and ${blameUserList[key]}'s`;
                    } else {
                        blameString += `${blameUserList[key]}, `;
                    }
                } else {
                    if (key == (blameUserList.length - 1).toString()) {
                        blameString += `and ${blameUserList[key]}'s`;
                    } else {
                        blameString += `${blameUserList[key]} `;
                    }
                }
            }

            if (serverConfig.blame.cursing) {
                embedCustom(
                    interaction,
                    'Blame',
                    '#B54A65',
                    `It's ${blameString} fault fuck those guys in particular!`,
                    {
                        text: `Requested by ${interaction.user.tag}`,
                        iconURL: null,
                    },
                    null,
                    [],
                    null,
                    null
                );
            } else {
                embedCustom(
                    interaction,
                    'Blame',
                    '#B54A65',
                    `It's ${blameString} fault screw those guys in particular!`,
                    {
                        text: `Requested by ${interaction.user.tag}`,
                        iconURL: null,
                    },
                    null,
                    [],
                    null,
                    null
                );
            }
        }
    },
};
//#endregion

//#region Exports
export default blameSlashCommand;
//#endregion
