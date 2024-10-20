var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//#region Imports
import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { embedCustom, errorCustom, warnCustom, warnDisabled } from '../../helpers/embedSlashMessages.js';
import { addRemoveBlame, changeBlameOffset } from '../../internal/settingsFunctions.js';
import { MongooseServerConfig } from '../../models/serverConfigModel.js';
import { BlameSubCommands } from '../../models/subCommandModels.js';
//#endregion
//#region This exports the blame command with the information about it
const editBlameSlashCommand = {
    data: new SlashCommandBuilder()
        .setName('editblame')
        .setDescription('Admin commands for the blame command.')
        .addSubcommand((subcommand) => subcommand
        .setName(BlameSubCommands.Add)
        .setDescription('Adds a user to the rotating blame list.')
        .addUserOption((option) => option.setName('person').setDescription("A person's name/username.").setRequired(true)))
        .addSubcommand((subcommand) => subcommand
        .setName(BlameSubCommands.AddPerm)
        .setDescription('Adds a user to the permanent blame list.')
        .addUserOption((option) => option.setName('person').setDescription("A person's name/username.").setRequired(true)))
        .addSubcommand((subcommand) => subcommand
        .setName(BlameSubCommands.Remove)
        .setDescription('Removes a user from the rotating blame list.')
        .addUserOption((option) => option.setName('person').setDescription("A person's name/username.").setRequired(true)))
        .addSubcommand((subcommand) => subcommand
        .setName(BlameSubCommands.RemovePerm)
        .setDescription('Removes a user from the permanent blame list.')
        .addUserOption((option) => option.setName('person').setDescription("A person's name/username.").setRequired(true)))
        .addSubcommand((subcommand) => subcommand.setName(BlameSubCommands.List).setDescription('Shows the current blame lists.'))
        .addSubcommand((subcommand) => subcommand
        .setName(BlameSubCommands.Fix)
        .setDescription('Fixes the current weeks blame to the specified person.')
        .addIntegerOption((option) => option.setName('person').setDescription("The person's position in the list.").setRequired(true)))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            //#region Escape Logic
            if (!interaction.isChatInputCommand()) {
                return;
            }
            //Calls serverConfig from database
            let serverConfig = (yield MongooseServerConfig.findById(interaction.guildId).exec()).toObject();
            if (!serverConfig.blame.enable) {
                warnDisabled(interaction, 'blame', editBlameSlashCommand.data.name);
                return;
            }
            //#endregion
            let erroredOut = false;
            //Handles the blame sub commands
            switch (interaction.options.getSubcommand()) {
                //Adds a person to the blame rotation
                case BlameSubCommands.Add: {
                    const argsString = interaction.options.getUser('person');
                    serverConfig = yield addRemoveBlame(true, false, argsString, serverConfig).catch((err) => {
                        if (err.name == 'PersonExists' || err.name == 'PersonNotExists') {
                            warnCustom(interaction, err.message, '/editblame' + interaction.options.getSubcommand());
                        }
                        else {
                            errorCustom(interaction, err.message, '/editblame' + interaction.options.getSubcommand(), client);
                        }
                        erroredOut = true;
                        return serverConfig;
                    });
                    if (!erroredOut) {
                        embedCustom(interaction, 'Success', '#00FF00', `Successfully added ${argsString} to the rotating blame list.`, {
                            text: `Requested by ${interaction.user.tag}`,
                            iconURL: null,
                        }, null, [], null, null);
                    }
                    break;
                }
                //Adds a person to the permanent blame list
                case BlameSubCommands.AddPerm: {
                    const argsString = interaction.options.getUser('person');
                    serverConfig = yield addRemoveBlame(true, true, argsString, serverConfig).catch((err) => {
                        if (err.name == 'PersonExists' || err.name == 'PersonNotExists') {
                            warnCustom(interaction, err.message, '/editblame' + interaction.options.getSubcommand());
                        }
                        else {
                            errorCustom(interaction, err.message, '/editblame' + interaction.options.getSubcommand(), client);
                        }
                        erroredOut = true;
                        return serverConfig;
                    });
                    if (!erroredOut) {
                        embedCustom(interaction, 'Success', '#00FF00', `Successfully added ${argsString} to the rotating blame list.`, {
                            text: `Requested by ${interaction.user.tag}`,
                            iconURL: null,
                        }, null, [], null, null);
                    }
                    break;
                }
                //Removes a person from the blame rotation
                case BlameSubCommands.Remove: {
                    const argsString = interaction.options.getUser('person');
                    serverConfig = yield addRemoveBlame(false, false, argsString, serverConfig).catch((err) => {
                        if (err.name == 'PersonExists' || err.name == 'PersonNotExists') {
                            warnCustom(interaction, err.message, '/editblame' + interaction.options.getSubcommand());
                        }
                        else {
                            errorCustom(interaction, err.message, '/editblame' + interaction.options.getSubcommand(), client);
                        }
                        erroredOut = true;
                        return serverConfig;
                    });
                    if (!erroredOut) {
                        embedCustom(interaction, 'Success', '#00FF00', `Successfully removed ${argsString} to the rotating blame list.`, {
                            text: `Requested by ${interaction.user.tag}`,
                            iconURL: null,
                        }, null, [], null, null);
                    }
                    break;
                }
                //Removes a person from the permanent blame list
                case BlameSubCommands.RemovePerm: {
                    const argsString = interaction.options.getUser('person');
                    serverConfig = yield addRemoveBlame(false, true, argsString, serverConfig).catch((err) => {
                        if (err.name == 'PersonExists' || err.name == 'PersonNotExists') {
                            warnCustom(interaction, err.message, '/editblame' + interaction.options.getSubcommand());
                        }
                        else {
                            errorCustom(interaction, err.message, '/editblame' + interaction.options.getSubcommand(), client);
                        }
                        erroredOut = true;
                        return serverConfig;
                    });
                    if (!erroredOut) {
                        embedCustom(interaction, 'Success', '#00FF00', `Successfully removed ${argsString} to the rotating blame list.`, {
                            text: `Requested by ${interaction.user.tag}`,
                            iconURL: null,
                        }, null, [], null, null);
                    }
                    break;
                }
                //Send the list to the user
                case BlameSubCommands.List: {
                    let rBlameString = '';
                    let pBlameString = '';
                    for (const key in serverConfig.blame.permList) {
                        let blameUser = client.users.cache.get(serverConfig.blame.permList[key]);
                        if (blameUser == undefined) {
                            blameUser = yield client.users.fetch(serverConfig.blame.permList[key]);
                        }
                        if (key == (serverConfig.blame.permList.length - 1).toString()) {
                            pBlameString += `${blameUser}`;
                        }
                        else {
                            pBlameString += `${blameUser}, `;
                        }
                    }
                    for (const key in serverConfig.blame.rotateList) {
                        let blameUser = client.users.cache.get(serverConfig.blame.rotateList[key]);
                        if (blameUser == undefined) {
                            blameUser = yield client.users.fetch(serverConfig.blame.rotateList[key]);
                        }
                        if (key == (serverConfig.blame.rotateList.length - 1).toString()) {
                            rBlameString += `${blameUser}`;
                        }
                        else {
                            rBlameString += `${blameUser}, `;
                        }
                    }
                    embedCustom(interaction, 'Blame List:', '#B54A65', `Rotating Blame List: ${rBlameString}\nPermanent Blame List: ${pBlameString}`, {
                        text: `Requested by ${interaction.user.tag}`,
                        iconURL: null,
                    }, null, [], null, null);
                    break;
                }
                //Fixes the person whose week it is
                case BlameSubCommands.Fix: {
                    const value = interaction.options.getInteger('person');
                    //Checks to see that user input is valid
                    if (Number.isNaN(value) || value < 1 || value > serverConfig.blame.rotateList.length) {
                        return warnCustom(interaction, `You must put a number between 1 and ${serverConfig.blame.rotateList.length}`, this.name);
                    }
                    const currentVal = Math.floor((Date.now() - 493200000) / 604800000) -
                        Math.floor(Math.floor((Date.now() - 493200000) / 604800000) / serverConfig.blame.rotateList.length) * serverConfig.blame.rotateList.length;
                    //Checks to see if the user input matches current offset
                    if (currentVal - serverConfig.blame.offset == value - 1) {
                        warnCustom(interaction, "It is already that user's week!", this.name);
                        return;
                    }
                    console.log(currentVal);
                    console.log(currentVal - serverConfig.blame.offset);
                    console.log(value - 1 - (currentVal - serverConfig.blame.offset));
                    serverConfig = yield changeBlameOffset(interaction.guildId, serverConfig.blame.offset - (value - 1 - (currentVal - serverConfig.blame.offset)), serverConfig).catch((err) => {
                        errorCustom(interaction, err.message, '/blame fix', client);
                        erroredOut = true;
                        return serverConfig;
                    });
                    let blameUser = client.users.cache.get(serverConfig.blame.rotateList[value - 1]);
                    if (blameUser == undefined) {
                        blameUser = yield client.users.fetch(serverConfig.blame.rotateList[value - 1]);
                    }
                    if (!erroredOut) {
                        embedCustom(interaction, 'Success', '#00FF00', `Successfully changed ${blameUser} to the current one to blame.`, {
                            text: `Requested by ${interaction.user.tag}`,
                            iconURL: null,
                        }, null, [], null, null);
                    }
                    break;
                }
                default: {
                    warnCustom(interaction, 'Not an option for the editblame command!', '/editblame');
                    break;
                }
            }
        });
    },
};
//#endregion
//#region Exports
export default editBlameSlashCommand;
//#endregion
