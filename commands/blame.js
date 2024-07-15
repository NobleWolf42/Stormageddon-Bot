//#region Data Files
var serverConfig = require('../data/serverConfig.json');
//#endregion

//#region Helpers
const { embedCustom, warnDisabled, errorCustom, warnCustom, errorNoAdmin } = require('../helpers/embedMessages.js');
const { adminCheck } = require('../helpers/userPermissions.js');
//#endregion

//#region Internals
const { addRemoveBlame, changeBlameOffset } = require("../internal/settingsFunctions.js");
//#endregion


//#region This exports the blame command with the information about it
module.exports = {
    name: "blame",
    type: ['Guild'],
    aliases: [],
    coolDown: 0,
    class: 'fun',
    usage: 'blame ""/add/remove/addperm/removeperm/list/fix ***FOR-ADD/REMOVE/ADDPERM/REMOVEPERM-ONLY-TYPE-NAME-HERE***/***FIX-ONLY-NUMBER-IN-LIST-OF-PERSON***',
    description: "Blames someone based on a weekly rotation. Can also add someone to a permanent blame list. Add/Remove/AddPerm/RemovePerm/List are Admin ONLY Commands.",
    async execute(message, args, client, distube) {
        var serverID = message.guild.id;
        var erroredOut = false;
        var adminTF = adminCheck(message);
        var oldSubCommand = ` ${args[0]}`;

        if (serverConfig[serverID].blame.enable) {
            //Handles the blame sub commands
            switch (args[0]) {
                //Adds a person to the blame rotation
                case "add":
                    if (!adminTF) {
                        errorNoAdmin(message, module.name + oldSubCommand);
                    }
                    args = args.splice(1);
                    var argsString = args.join(' ');
                    serverConfig = await addRemoveBlame(serverID, true, false, argsString).catch((err) => {
                        if (err.name == "PersonExists" || err.name == "PersonNotExists") {
                            warnCustom(message, err.message, "blame" + oldSubCommand);
                        } else {
                            errorCustom(message, err.message, "blame" + oldSubCommand, client);
                        }

                        erroredOut = true;
                        return serverConfig;
                    });

                    if (!erroredOut) {
                        embedCustom(message, "Success", "#00FF00", `Successfully added ${argsString} to the rotating blame list.`, { text: `Requested by ${message.author.tag}`, iconURL: null }, null, [], null, null);
                    }
                break;

                //Adds a person to the permanent blame list
                case "addperm":
                    if (!adminTF) {
                        errorNoAdmin(message, module.name + oldSubCommand);
                    }
                    args = args.splice(1);
                    var argsString = args.join(' ');
                    serverConfig = await addRemoveBlame(serverID, true, true, argsString).catch((err) => {
                        if (err.name == "PersonExists" || err.name == "PersonNotExists") {
                            warnCustom(message, err.message, "blame" + oldSubCommand);
                        } else {
                            errorCustom(message, err.message, "blame" + oldSubCommand, client);
                        }

                        erroredOut = true;
                        return serverConfig;
                    });

                    if (!erroredOut) {
                        embedCustom(message, "Success", "#00FF00", `Successfully added ${argsString} to the rotating blame list.`, { text: `Requested by ${message.author.tag}`, iconURL: null }, null, [], null, null);
                    }
                break;

                //Removes a person from the blame rotation
                case "remove":
                    if (!adminTF) {
                        errorNoAdmin(message, module.name + oldSubCommand);
                    }
                    args = args.splice(1);
                    var argsString = args.join(' ');
                    serverConfig = await addRemoveBlame(serverID, false, false, argsString).catch((err) => {
                        if (err.name == "PersonExists" || err.name == "PersonNotExists") {
                            warnCustom(message, err.message, "blame" + oldSubCommand);
                        } else {
                            errorCustom(message, err.message, "blame" + oldSubCommand, client);
                        }

                        erroredOut = true;
                        return serverConfig;
                    });

                    if (!erroredOut) {
                        embedCustom(message, "Success", "#00FF00", `Successfully removed ${argsString} to the rotating blame list.`, { text: `Requested by ${message.author.tag}`, iconURL: null }, null, [], null, null);
                    }
                break;

                //Removes a person from the permanent blame list
                case "removeperm":
                    if (!adminTF) {
                        errorNoAdmin(message, module.name + oldSubCommand);
                    }
                    args = args.splice(1);
                    var argsString = args.join(' ');
                    serverConfig = await addRemoveBlame(serverID, false, true, argsString).catch((err) => {
                        if (err.name == "PersonExists" || err.name == "PersonNotExists") {
                            warnCustom(message, err.message, "blame" + oldSubCommand);
                        } else {
                            errorCustom(message, err.message, "blame" + oldSubCommand, client);
                        }

                        erroredOut = true;
                        return serverConfig;
                    });

                    if (!erroredOut) {
                        embedCustom(message, "Success", "#00FF00", `Successfully removed ${argsString} to the rotating blame list.`, { text: `Requested by ${message.author.tag}`, iconURL: null }, null, [], null, null)
                    }
                break;

                //Send the list to the user
                case "list":
                    var rBlameString = "";
                    var pBlameString = "";

                    if (!adminTF) {
                        errorNoAdmin(message, module.name + oldSubCommand);
                    }

                    for (key in serverConfig[serverID].blame.permList) {
                        if (key == serverConfig[serverID].blame.permList.length - 1) {
                            pBlameString += `${serverConfig[serverID].blame.permList[key]}`;
                        } else {
                            pBlameString += `${serverConfig[serverID].blame.permList[key]}, `;
                        }
                    }

                    for (key in serverConfig[serverID].blame.rotateList) {
                        if (key == serverConfig[serverID].blame.rotateList.length - 1) {
                            rBlameString += `${serverConfig[serverID].blame.rotateList[key]}`;
                        } else {
                            rBlameString += `${serverConfig[serverID].blame.rotateList[key]}, `;
                        }
                    }
                    
                    embedCustom(message, "Blame List:", "#B54A65", `Rotating Blame List: ${rBlameString}\nPermanent Blame List: ${pBlameString}`, { text: `Requested by ${message.author.tag}`, iconURL: null }, null, [], null, null)
                break;

                //Fixes the person whose week it is
                case "fix":
                    var currentVal = Math.floor((Date.now() - 410400000) / 604800000) - (Math.floor(Math.floor((Date.now() - 410400000) / 604800000) / serverConfig[serverID].blame.rotateList.length) * serverConfig[serverID].blame.rotateList.length) - serverConfig[serverID].blame.offset;

                    if (args[1] == undefined || args[1] < 1 || args[1] > serverConfig[serverID].blame.rotateList) {
                        return warnCustom(message, `You must put a number between 1 and ${serverConfig[serverID].blame.rotateList.length}`, module.name)
                    }

                    var wantedVal = args[1] - 1;

                    if (currentVal != wantedVal) {
                        var offset =  currentVal - wantedVal;

                        console.log(currentVal);
                        console.log(wantedVal);
                        console.log(offset);

                        serverConfig = await changeBlameOffset(serverID, offset).catch((err) => {
                            errorCustom(message, err.message, "blame" + oldSubCommand, client);

                            erroredOut = true;
                            return serverConfig;
                        });
    
                        if (!erroredOut) {
                            embedCustom(message, "Success", "#00FF00", `Successfully changed ${serverConfig[serverID].blame.rotateList[wantedVal]} to the current one to blame.`, { text: `Requested by ${message.author.tag}`, iconURL: null }, null, [], null, null)
                        }
                    } else {
                        warnCustom(message, "It is already that user's week!", module.name);
                    }
                break;

                //Blames a person
                default:
                    var blameList = serverConfig[serverID].blame.permList;
                    var blameString = "";
                    if (serverConfig[serverID].blame.rotateList.length > 0) {
                        blameList.push(serverConfig[serverID].blame.rotateList[Math.floor((Date.now() - 410400) / 604800000) - (Math.floor(Math.floor((Date.now() - 410400) / 604800000) / serverConfig[serverID].blame.rotateList.length) * serverConfig[serverID].blame.rotateList.length) - serverConfig[serverID].blame.offset]);
                    } else if (blameList.length < 1) {
                        return warnCustom(message, "The blame list is empty!", module.name);
                    }

                    if (blameList.length == 1) {
                        if (serverConfig[serverID].blame.cursing) {
                            embedCustom(message, "Blame", "#B54A65", `It's ${blameList[0]}'s fault fuck that guy in particular!`, { text: `Requested by ${message.author.tag}`, iconURL: null }, null, [], null, null);
                        } else {
                            embedCustom(message, "Blame", "#B54A65", `It's ${blameList[0]}'s fault screw that guy in particular!`, { text: `Requested by ${message.author.tag}`, iconURL: null }, null, [], null, null);
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
                            embedCustom(message, "Blame", "#B54A65", `It's ${blameString} fault fuck those guys in particular!`, { text: `Requested by ${message.author.tag}`, iconURL: null }, null, [], null, null);
                        } else {
                            embedCustom(message, "Blame", "#B54A65", `It's ${blameString} fault screw those guys in particular!`, { text: `Requested by ${message.author.tag}`, iconURL: null }, null, [], null, null);
                        }
                    }

                    
                break;
            }
        } else {
            warnDisabled(message, "blame", module.name);
        }
    }
}
//#endregion
