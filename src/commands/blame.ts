//#region Import
import { User } from 'discord.js';
import { embedCustom, warnDisabled, errorCustom, warnCustom, errorNoAdmin } from '../helpers/embedMessages.js';
import { adminCheck } from '../helpers/userPermissions.js';
import { addRemoveBlame, changeBlameOffset } from '../internal/settingsFunctions.js';
import { Command } from '../models/commandModel.js';
//#endregion

//#region This creates the blame command with the information about it
const blameCommand: Command = {
    name: 'blame',
    type: ['Guild'],
    aliases: [],
    coolDown: 0,
    class: 'fun',
    usage: 'blame ""/add/remove/addperm/removeperm/list/fix ***FOR-ADD/REMOVE/ADDPERM/REMOVEPERM-ONLY-TYPE-NAME-HERE***/***FIX-ONLY-NUMBER-IN-LIST-OF-PERSON***',
    description: 'Blames someone based on a weekly rotation. Can also add someone to a permanent blame list. Add/Remove/AddPerm/RemovePerm/List are Admin ONLY Commands.',
    async execute(message, args, client, distube, collections, serverConfig) {
        var serverID = message.guild.id;
        var erroredOut = false;
        var adminTF = adminCheck(message);
        var oldSubCommand = ` ${args[0]}`;

        if (serverConfig.blame.enable) {
            //Handles the blame sub commands
            switch (args[0]) {
                //Adds a person to the blame rotation
                case 'add':
                    if (!adminTF) {
                        errorNoAdmin(message, this.name + oldSubCommand);
                    }
                    args = args.splice(1);
                    var argsString = args.join(' ');
                    serverConfig = await addRemoveBlame(serverID, true, false, argsString).catch((err) => {
                        if (err.name == 'PersonExists' || err.name == 'PersonNotExists') {
                            warnCustom(message, err.message, 'blame' + oldSubCommand);
                        } else {
                            errorCustom(message, err.message, 'blame' + oldSubCommand, client);
                        }

                        erroredOut = true;
                        return serverConfig;
                    });

                    if (!erroredOut) {
                        embedCustom(
                            message,
                            'Success',
                            '#00FF00',
                            `Successfully added ${argsString} to the rotating blame list.`,
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
                    break;

                //Adds a person to the permanent blame list
                case 'addperm':
                    if (!adminTF) {
                        errorNoAdmin(message, this.name + oldSubCommand);
                    }
                    args = args.splice(1);
                    var argsString = args.join(' ');
                    serverConfig = await addRemoveBlame(serverID, true, true, argsString).catch((err) => {
                        if (err.name == 'PersonExists' || err.name == 'PersonNotExists') {
                            warnCustom(message, err.message, 'blame' + oldSubCommand);
                        } else {
                            errorCustom(message, err.message, 'blame' + oldSubCommand, client);
                        }

                        erroredOut = true;
                        return serverConfig;
                    });

                    if (!erroredOut) {
                        embedCustom(
                            message,
                            'Success',
                            '#00FF00',
                            `Successfully added ${argsString} to the rotating blame list.`,
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
                    break;

                //Removes a person from the blame rotation
                case 'remove':
                    if (!adminTF) {
                        errorNoAdmin(message, this.name + oldSubCommand);
                    }
                    args = args.splice(1);
                    var argsString = args.join(' ');
                    serverConfig = await addRemoveBlame(serverID, false, false, argsString).catch((err) => {
                        if (err.name == 'PersonExists' || err.name == 'PersonNotExists') {
                            warnCustom(message, err.message, 'blame' + oldSubCommand);
                        } else {
                            errorCustom(message, err.message, 'blame' + oldSubCommand, client);
                        }

                        erroredOut = true;
                        return serverConfig;
                    });

                    if (!erroredOut) {
                        embedCustom(
                            message,
                            'Success',
                            '#00FF00',
                            `Successfully removed ${argsString} to the rotating blame list.`,
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
                    break;

                //Removes a person from the permanent blame list
                case 'removeperm':
                    if (!adminTF) {
                        errorNoAdmin(message, this.name + oldSubCommand);
                    }
                    args = args.splice(1);
                    var argsString = args.join(' ');
                    serverConfig = await addRemoveBlame(serverID, false, true, argsString).catch((err) => {
                        if (err.name == 'PersonExists' || err.name == 'PersonNotExists') {
                            warnCustom(message, err.message, 'blame' + oldSubCommand);
                        } else {
                            errorCustom(message, err.message, 'blame' + oldSubCommand, client);
                        }

                        erroredOut = true;
                        return serverConfig;
                    });

                    if (!erroredOut) {
                        embedCustom(
                            message,
                            'Success',
                            '#00FF00',
                            `Successfully removed ${argsString} to the rotating blame list.`,
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
                    break;

                //Send the list to the user
                case 'list':
                    var rBlameString = '';
                    var pBlameString = '';

                    if (!adminTF) {
                        errorNoAdmin(message, this.name + oldSubCommand);
                    }

                    for (let key in serverConfig.blame.permList) {
                        let blameUser = client.users.cache.get(serverConfig.blame.permList[key]);

                        if (blameUser == undefined) {
                            blameUser = await client.users.fetch(serverConfig.blame.permList[key]);
                        }

                        if (key == (serverConfig.blame.permList.length - 1).toString()) {
                            pBlameString += `${blameUser}`;
                        } else {
                            pBlameString += `${blameUser}, `;
                        }
                    }

                    for (let key in serverConfig.blame.rotateList) {
                        let blameUser = client.users.cache.get(serverConfig.blame.rotateList[key]);

                        if (blameUser == undefined) {
                            blameUser = await client.users.fetch(serverConfig.blame.rotateList[key]);
                        }

                        if (key == (serverConfig.blame.rotateList.length - 1).toString()) {
                            rBlameString += `${blameUser}`;
                        } else {
                            rBlameString += `${blameUser}, `;
                        }
                    }

                    embedCustom(
                        message,
                        'Blame List:',
                        '#B54A65',
                        `Rotating Blame List: ${rBlameString}\nPermanent Blame List: ${pBlameString}`,
                        {
                            text: `Requested by ${message.author.tag}`,
                            iconURL: null,
                        },
                        null,
                        [],
                        null,
                        null
                    );
                    break;

                //Fixes the person whose week it is
                case 'fix':
                    var currentVal =
                        Math.floor((Date.now() - 493200000) / 604800000) -
                        Math.floor(Math.floor((Date.now() - 493200000) / 604800000) / serverConfig.blame.rotateList.length) * serverConfig.blame.rotateList.length;

                    const value = Number(args[1]);

                    if (value == undefined || value < 1 || value > serverConfig.blame.rotateList.length) {
                        return warnCustom(message, `You must put a number between 1 and ${serverConfig.blame.rotateList.length}`, this.name);
                    }

                    var wantedVal = value - 1;

                    if (currentVal != wantedVal) {
                        var offset = currentVal - wantedVal;

                        serverConfig = await changeBlameOffset(serverID, offset).catch((err) => {
                            errorCustom(message, err.message, 'blame' + oldSubCommand, client);

                            erroredOut = true;
                            return serverConfig;
                        });

                        if (!erroredOut) {
                            embedCustom(
                                message,
                                'Success',
                                '#00FF00',
                                `Successfully changed ${serverConfig.blame.rotateList[wantedVal]} to the current one to blame.`,
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
                    } else {
                        warnCustom(message, "It is already that user's week!", this.name);
                    }
                    break;

                //Blames a person
                default:
                    var blameList: User[] = [];

                    for (let key in serverConfig.blame.permList) {
                        var blameUser = client.users.cache.get(serverConfig.blame.permList[key]);

                        if (blameUser == undefined) {
                            blameUser = await client.users.fetch(serverConfig.blame.permList[key]);
                        }

                        blameList.push(blameUser);
                    }

                    var blameString = '';
                    if (serverConfig.blame.rotateList.length > 0) {
                        var rotateIndex =
                            Math.floor((Date.now() - 493200000) / 604800000) -
                            Math.floor(Math.floor((Date.now() - 493200000) / 604800000) / serverConfig.blame.rotateList.length) * serverConfig.blame.rotateList.length -
                            serverConfig.blame.offset;

                        if (rotateIndex >= serverConfig.blame.rotateList.length) {
                            rotateIndex -= serverConfig.blame.rotateList.length;
                        } else if (rotateIndex < 0) {
                            rotateIndex += serverConfig.blame.rotateList.length;
                        }

                        var blameUser = client.users.cache.get(serverConfig.blame.rotateList[rotateIndex]);

                        if (blameUser == undefined) {
                            blameUser = await client.users.fetch(serverConfig.blame.rotateList[rotateIndex]);
                        }

                        blameList.push(blameUser);
                    } else if (blameList.length < 1) {
                        return warnCustom(message, 'The blame list is empty!', this.name);
                    }

                    if (blameList.length == 1) {
                        if (serverConfig.blame.cursing) {
                            embedCustom(
                                message,
                                'Blame',
                                '#B54A65',
                                `It's ${blameList[0]}'s fault fuck that guy in particular!`,
                                {
                                    text: `Requested by ${message.author.tag}`,
                                    iconURL: null,
                                },
                                null,
                                [],
                                null,
                                null
                            );
                        } else {
                            embedCustom(
                                message,
                                'Blame',
                                '#B54A65',
                                `It's ${blameList[0]}'s fault screw that guy in particular!`,
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
                    } else {
                        for (let key in blameList) {
                            if (blameList.length > 2) {
                                if (key == (blameList.length - 1).toString()) {
                                    blameString += `and ${blameList[key]}'s`;
                                } else {
                                    blameString += `${blameList[key]}, `;
                                }
                            } else {
                                if (key == (blameList.length - 1).toString()) {
                                    blameString += `and ${blameList[key]}'s`;
                                } else {
                                    blameString += `${blameList[key]} `;
                                }
                            }
                        }

                        if (serverConfig.blame.cursing) {
                            embedCustom(
                                message,
                                'Blame',
                                '#B54A65',
                                `It's ${blameString} fault fuck those guys in particular!`,
                                {
                                    text: `Requested by ${message.author.tag}`,
                                    iconURL: null,
                                },
                                null,
                                [],
                                null,
                                null
                            );
                        } else {
                            embedCustom(
                                message,
                                'Blame',
                                '#B54A65',
                                `It's ${blameString} fault screw those guys in particular!`,
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
                    }
                    break;
            }
        } else {
            warnDisabled(message, 'blame', this.name);
        }
    },
};
//#endregion

//#region
export default blameCommand;
//#endregion
