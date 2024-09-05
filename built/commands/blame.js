var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { embedCustom, warnDisabled, errorCustom, warnCustom, errorNoAdmin } from '../helpers/embedMessages.js';
import { adminCheck } from '../helpers/userPermissions.js';
import { addRemoveBlame, buildConfigFile, changeBlameOffset } from '../internal/settingsFunctions.js';
import { ErrorType } from '../models/loggingModel.js';
import { BlameSubCommands } from '../models/subCommandModels.js';
//#endregion
//#region This creates the blame command with the information about it
const blameCommand = {
    name: 'blame',
    type: ['Guild'],
    aliases: [],
    coolDown: 0,
    class: 'fun',
    usage: `blame ""/${BlameSubCommands.Add}/${BlameSubCommands.Remove}/${BlameSubCommands.AddPerm}/${BlameSubCommands.RemovePerm}/${BlameSubCommands.List}/${BlameSubCommands.Fix} ***FOR-ADD/REMOVE/ADDPERM/REMOVEPERM:@USERS***/***FIX-ONLY:NUMBER-IN-LIST-OF-PERSON***`,
    description: 'Blames someone based on a weekly rotation. Can also add someone to a permanent blame list. Add/Remove/AddPerm/RemovePerm/List are Admin ONLY Commands.',
    execute(message, args, client, _distube, _collections, serverConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            //#region Escape Logic
            //Checks to see if the blame feature is enabled
            if (!serverConfig.blame.enable) {
                warnDisabled(message, 'blame', this.name);
                return;
            }
            //#endregion
            let erroredOut = false;
            const oldSubCommand = ` ${args[0]}`;
            //Handles the blame sub commands args is the user input split by ' '
            switch (args[0]) {
                //#region Adds a person to the blame rotation
                case BlameSubCommands.Add: {
                    //Checks to see the the user is a bot admin
                    if (!adminCheck(message, serverConfig)) {
                        errorNoAdmin(message, this.name + oldSubCommand);
                        return;
                    }
                    const userList = [];
                    for (const [_, user] of message.mentions.members) {
                        serverConfig = yield addRemoveBlame(message.guild.id, true, false, user.user, serverConfig).catch((err) => {
                            if (err.name == ErrorType.PersonExists || err.name == ErrorType.PersonNotExists) {
                                warnCustom(message, err.message, 'blame' + oldSubCommand);
                            }
                            else {
                                errorCustom(message, err.message, 'blame' + oldSubCommand, client);
                            }
                            erroredOut = true;
                            return serverConfig;
                        });
                        userList.push(user.user);
                    }
                    if (!erroredOut) {
                        yield buildConfigFile(serverConfig, message.guildId);
                        let userString = '';
                        userList.forEach((user) => {
                            if (userList.length == 1) {
                                userString = `${user}`;
                            }
                            else if (userList[userList.length - 1] != user) {
                                userString += `${user}, `;
                            }
                            else {
                                userString += ` and ${user}`;
                            }
                        });
                        embedCustom(message, 'Success', '#00FF00', `Successfully added ${userString} to the rotating blame list.`, {
                            text: `Requested by ${message.author.tag}`,
                            iconURL: null,
                        }, null, [], null, null);
                    }
                    break;
                }
                //#endregion
                //#region Adds a person to the permanent blame list
                case BlameSubCommands.AddPerm: {
                    //Checks to see if the user is a bot admin
                    if (!adminCheck(message, serverConfig)) {
                        errorNoAdmin(message, this.name + oldSubCommand);
                        return;
                    }
                    const userList = [];
                    for (const [_, user] of message.mentions.members) {
                        serverConfig = yield addRemoveBlame(message.guild.id, true, true, user.user, serverConfig).catch((err) => {
                            if (err.name == ErrorType.PersonExists || err.name == ErrorType.PersonNotExists) {
                                warnCustom(message, err.message, 'blame' + oldSubCommand);
                            }
                            else {
                                errorCustom(message, err.message, 'blame' + oldSubCommand, client);
                            }
                            erroredOut = true;
                            return serverConfig;
                        });
                        userList.push(user.user);
                    }
                    if (!erroredOut) {
                        yield buildConfigFile(serverConfig, message.guildId);
                        let userString = '';
                        userList.forEach((user) => {
                            if (userList.length == 1) {
                                userString = `${user}`;
                            }
                            else if (userList[userList.length - 1] != user) {
                                userString = userString + `${user}, `;
                            }
                            else {
                                userString = userString + ` and ${user}`;
                            }
                        });
                        embedCustom(message, 'Success', '#00FF00', `Successfully added ${userString} to the permanent blame list.`, {
                            text: `Requested by ${message.author.tag}`,
                            iconURL: null,
                        }, null, [], null, null);
                    }
                    break;
                }
                //#endregion
                //#region Removes a person from the blame rotation
                case BlameSubCommands.Remove: {
                    //Checks to see if the user is a bot admin
                    if (!adminCheck(message, serverConfig)) {
                        errorNoAdmin(message, this.name + oldSubCommand);
                        return;
                    }
                    const userList = [];
                    for (const [_, user] of message.mentions.members) {
                        serverConfig = yield addRemoveBlame(message.guild.id, false, false, user.user, serverConfig).catch((err) => {
                            if (err.name == ErrorType.PersonExists || err.name == ErrorType.PersonNotExists) {
                                warnCustom(message, err.message, 'blame' + oldSubCommand);
                            }
                            else {
                                errorCustom(message, err.message, 'blame' + oldSubCommand, client);
                            }
                            erroredOut = true;
                            return serverConfig;
                        });
                        userList.push(user.user);
                    }
                    if (!erroredOut) {
                        yield buildConfigFile(serverConfig, message.guildId);
                        let userString = '';
                        userList.forEach((user) => {
                            if (userList.length == 1) {
                                userString = `${user}`;
                            }
                            else if (userList[userList.length - 1] != user) {
                                userString = userString + `${user}, `;
                            }
                            else {
                                userString = userString + ` and ${user}`;
                            }
                        });
                        embedCustom(message, 'Success', '#00FF00', `Successfully removed ${userString} from the rotating blame list.`, {
                            text: `Requested by ${message.author.tag}`,
                            iconURL: null,
                        }, null, [], null, null);
                    }
                    break;
                }
                //#endregion
                //#region Removes a person from the permanent blame list
                case BlameSubCommands.RemovePerm: {
                    //Checks to see if the user is a bot admin
                    if (!adminCheck(message, serverConfig)) {
                        errorNoAdmin(message, this.name + oldSubCommand);
                        return;
                    }
                    const userList = [];
                    for (const [_, user] of message.mentions.members) {
                        serverConfig = yield addRemoveBlame(message.guild.id, false, true, user.user, serverConfig).catch((err) => {
                            if (err.name == ErrorType.PersonExists || err.name == ErrorType.PersonNotExists) {
                                warnCustom(message, err.message, 'blame' + oldSubCommand);
                            }
                            else {
                                errorCustom(message, err.message, 'blame' + oldSubCommand, client);
                            }
                            erroredOut = true;
                            return serverConfig;
                        });
                        userList.push(user.user);
                    }
                    if (!erroredOut) {
                        yield buildConfigFile(serverConfig, message.guildId);
                        let userString = '';
                        userList.forEach((user) => {
                            if (userList.length == 1) {
                                userString = `${user}`;
                            }
                            else if (userList[userList.length - 1] != user) {
                                userString = userString + `${user}, `;
                            }
                            else {
                                userString = userString + ` and ${user}`;
                            }
                        });
                        embedCustom(message, 'Success', '#00FF00', `Successfully removed ${userString} from the permanent blame list.`, {
                            text: `Requested by ${message.author.tag}`,
                            iconURL: null,
                        }, null, [], null, null);
                    }
                    break;
                }
                //#endregion
                //#region Send the list to the user
                case BlameSubCommands.List: {
                    //Checks to see if the user is a bot admin
                    if (!adminCheck(message, serverConfig)) {
                        errorNoAdmin(message, this.name + oldSubCommand);
                        return;
                    }
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
                    embedCustom(message, 'Blame List:', '#B54A65', `Rotating Blame List: ${rBlameString}\nPermanent Blame List: ${pBlameString}`, {
                        text: `Requested by ${message.author.tag}`,
                        iconURL: null,
                    }, null, [], null, null);
                    break;
                }
                //#endregion
                //#region Fixes the person whose week it is
                case BlameSubCommands.Fix: {
                    const value = Number(args[1]);
                    //Checks to see that user input is valid
                    if (Number.isNaN(value) || value < 1 || value > serverConfig.blame.rotateList.length) {
                        return warnCustom(message, `You must put a number between 1 and ${serverConfig.blame.rotateList.length}`, this.name);
                    }
                    const currentVal = Math.floor((Date.now() - 493200000) / 604800000) -
                        Math.floor(Math.floor((Date.now() - 493200000) / 604800000) / serverConfig.blame.rotateList.length) * serverConfig.blame.rotateList.length;
                    //Checks to see if the user input matches current offset
                    if (currentVal - serverConfig.blame.offset == value - 1) {
                        warnCustom(message, "It is already that user's week!", this.name);
                        return;
                    }
                    console.log(currentVal);
                    console.log(currentVal - serverConfig.blame.offset);
                    console.log(value - 1 - (currentVal - serverConfig.blame.offset));
                    serverConfig = yield changeBlameOffset(message.guild.id, serverConfig.blame.offset - (value - 1 - (currentVal - serverConfig.blame.offset))).catch((err) => {
                        errorCustom(message, err.message, 'blame' + oldSubCommand, client);
                        erroredOut = true;
                        return serverConfig;
                    });
                    let blameUser = client.users.cache.get(serverConfig.blame.rotateList[value - 1]);
                    if (blameUser == undefined) {
                        blameUser = yield client.users.fetch(serverConfig.blame.rotateList[value - 1]);
                    }
                    if (!erroredOut) {
                        embedCustom(message, 'Success', '#00FF00', `Successfully changed ${blameUser} to the current one to blame.`, {
                            text: `Requested by ${message.author.tag}`,
                            iconURL: null,
                        }, null, [], null, null);
                    }
                    break;
                }
                //#endregion
                //#region Blames a person
                case undefined: {
                    const blameList = [];
                    for (const key in serverConfig.blame.permList) {
                        let blameUser = client.users.cache.get(serverConfig.blame.permList[key]);
                        if (blameUser == undefined) {
                            blameUser = yield client.users.fetch(serverConfig.blame.permList[key]);
                        }
                        blameList.push(blameUser);
                    }
                    let blameString = '';
                    if (serverConfig.blame.rotateList.length > 0) {
                        let rotateIndex = Math.floor((Date.now() - 493200000) / 604800000) -
                            Math.floor(Math.floor((Date.now() - 493200000) / 604800000) / serverConfig.blame.rotateList.length) * serverConfig.blame.rotateList.length -
                            serverConfig.blame.offset;
                        console.log(rotateIndex);
                        if (rotateIndex >= serverConfig.blame.rotateList.length) {
                            rotateIndex -= serverConfig.blame.rotateList.length;
                        }
                        else if (rotateIndex < 0) {
                            rotateIndex += serverConfig.blame.rotateList.length;
                        }
                        let blameUser = client.users.cache.get(serverConfig.blame.rotateList[rotateIndex]);
                        if (blameUser == undefined) {
                            blameUser = yield client.users.fetch(serverConfig.blame.rotateList[rotateIndex]);
                        }
                        blameList.push(blameUser);
                    }
                    else if (blameList.length < 1) {
                        return warnCustom(message, 'The blame list is empty!', this.name);
                    }
                    if (blameList.length == 1) {
                        if (serverConfig.blame.cursing) {
                            embedCustom(message, 'Blame', '#B54A65', `It's ${blameList[0]}'s fault fuck that guy in particular!`, {
                                text: `Requested by ${message.author.tag}`,
                                iconURL: null,
                            }, null, [], null, null);
                        }
                        else {
                            embedCustom(message, 'Blame', '#B54A65', `It's ${blameList[0]}'s fault screw that guy in particular!`, {
                                text: `Requested by ${message.author.tag}`,
                                iconURL: null,
                            }, null, [], null, null);
                        }
                    }
                    else {
                        for (const key in blameList) {
                            if (blameList.length > 2) {
                                if (key == (blameList.length - 1).toString()) {
                                    blameString += `and ${blameList[key]}'s`;
                                }
                                else {
                                    blameString += `${blameList[key]}, `;
                                }
                            }
                            else {
                                if (key == (blameList.length - 1).toString()) {
                                    blameString += `and ${blameList[key]}'s`;
                                }
                                else {
                                    blameString += `${blameList[key]} `;
                                }
                            }
                        }
                        if (serverConfig.blame.cursing) {
                            embedCustom(message, 'Blame', '#B54A65', `It's ${blameString} fault fuck those guys in particular!`, {
                                text: `Requested by ${message.author.tag}`,
                                iconURL: null,
                            }, null, [], null, null);
                        }
                        else {
                            embedCustom(message, 'Blame', '#B54A65', `It's ${blameString} fault screw those guys in particular!`, {
                                text: `Requested by ${message.author.tag}`,
                                iconURL: null,
                            }, null, [], null, null);
                        }
                    }
                    break;
                }
                //#endregion
                //#region default case trigger an error
                default: {
                    warnCustom(message, `${args[0]} is not a valid subcommand of blame command!`, this.name);
                }
                //#endregion
            }
        });
    },
};
//#endregion
//#region
export default blameCommand;
//#endregion
