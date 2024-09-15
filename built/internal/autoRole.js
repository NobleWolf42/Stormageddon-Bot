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
import { Events } from 'discord.js';
import { MongooseServerConfig } from '../models/serverConfigModel.js';
import { MongooseAutoRoleList } from '../models/autoRoleList.js';
import { addToLog } from '../helpers/errorLog.js';
import { LogType } from '../models/loggingModel.js';
//#endregion
//#region Function that generates embed fields
/**
 * Generates the embed fields and ties the emoji to their respective role from serverConfig.
 * @param serverID - Server ID for the server the command is run in
 * @returns A map of the emoji-role pairs
 */
function generateEmbedFields(serverConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        return serverConfig.autoRole.roles.map((r, e) => {
            return {
                emoji: serverConfig.autoRole.reactions[e],
                role: r,
            };
        });
    });
}
//#endregion
//#region Function that starts the listening to see if a user hits a reaction, and gives them the role when they do react
/**
 * This function starts the listening to see if a user hits a reaction, and gives them the role when they do react.
 * @param client - Discord.js Client Object
 */
function autoRoleListener(client) {
    return __awaiter(this, void 0, void 0, function* () {
        //#region Loads Messages to Listen to
        const authRoleLists = yield MongooseAutoRoleList.find({}).exec();
        const channelObjects = [];
        for (const guild of authRoleLists) {
            for (const channels of guild.roleChannels) {
                channelObjects.push(channels);
            }
        }
        for (const channels of channelObjects) {
            const channel = yield client.channels.fetch(channels.id);
            if (!channel || channel.isDMBased() || !channel.isTextBased()) {
                return;
            }
            for (const msg of channels.messageIDs) {
                yield channel.messages.fetch(msg);
            }
        }
        //#endregion
        console.log('AutoRoleListener Started');
        //#region This event handel adding a role to a user when the react to the add role message
        client.on(Events.MessageReactionAdd, (reaction, user) => __awaiter(this, void 0, void 0, function* () {
            const message = reaction.message;
            //This escapes if the reaction was in a vc or dm, or done by a bot
            if (!message.channel.isTextBased() || message.channel.isDMBased() || user.bot) {
                return;
            }
            const serverID = message.channel.guild.id;
            const member = message.guild.members.cache.get(user.id);
            //Gets serverConfig from database
            const serverConfig = (yield MongooseServerConfig.findById(serverID).exec()).toObject();
            //Stops if the feature is not enabled
            if (!serverConfig.autoRole.enable) {
                return;
            }
            const emojiKey = reaction.emoji.id ? reaction.emoji.id : reaction.emoji.name; //`${reaction.emoji.name}:${reaction.emoji.id}`
            const react = message.reactions.cache.get(emojiKey);
            if (!react) {
                //Error, Reaction not Valid
                addToLog(LogType.Alert, `${reaction.emoji.name}:${reaction.emoji.id} - is not found`, member.user.tag, message.guild.name, message.channel.name, 'Issue with ReactEmoji Event', client);
            }
            if (message.author.id === client.user.id &&
                (message.content !== serverConfig.autoRole.embedMessage || (message.embeds[0] && message.embeds[0].footer.text !== serverConfig.autoRole.embedFooter))) {
                if (message.embeds.length >= 1) {
                    const fields = message.embeds[0].fields;
                    for (const { name, value } of fields) {
                        if (member.id !== client.user.id) {
                            const guildRole = message.guild.roles.cache.find((r) => r.name === value);
                            if (name === react.emoji.name || name === react.emoji.toString()) {
                                member.roles.add(guildRole.id);
                            }
                        }
                    }
                }
            }
        }));
        //#endregion
        //#region This handles when people remove a reaction in order to remove a role
        client.on(Events.MessageReactionRemove, (reaction, user) => __awaiter(this, void 0, void 0, function* () {
            const message = reaction.message;
            //This escapes if the reaction was in a vc or a dm, or done by a bot
            if (!message.channel.isTextBased() || message.channel.isDMBased() || user.bot) {
                return;
            }
            const serverID = message.channel.guild.id;
            const member = message.guild.members.cache.get(user.id);
            //Gets serverConfig from database
            const serverConfig = (yield MongooseServerConfig.findById(serverID).exec()).toObject();
            const emojiKey = reaction.emoji.id ? reaction.emoji.id : reaction.emoji.name; //`${reaction.emoji.name}:${reaction.emoji.id}`
            const react = message.reactions.cache.get(emojiKey);
            if (!react) {
                //Error, Reaction not Valid
                addToLog(LogType.Alert, `${emojiKey} - is not found`, member.user.tag, message.guild.name, message.channel.name, 'Issue with ReactEmoji Event', client);
            }
            if (message.author.id === client.user.id &&
                (message.content !== serverConfig.autoRole.embedMessage || (message.embeds[0] && message.embeds[0].footer.text !== serverConfig.autoRole.embedFooter))) {
                if (message.embeds.length >= 1) {
                    const fields = message.embeds[0].fields;
                    for (const { name, value } of fields) {
                        if (member.id !== client.user.id) {
                            const guildRole = message.guild.roles.cache.find((r) => r.name === value);
                            if (name === react.emoji.name || name === react.emoji.toString()) {
                                member.roles.remove(guildRole.id);
                            }
                        }
                    }
                }
            }
        }));
        //#endregion
        //#region Listens for a autoRole message to be deleted
        client.on(Events.MessageDelete, (event) => __awaiter(this, void 0, void 0, function* () {
            //This escapes if the deleted message was in a vc or dm, or not authored by this bot
            // if (event.channel.isDMBased() || !event.author || event.author == undefined || event.author.id != process.env.clientID) {
            //     return;
            // }
            //Pulls message listening info from db
            const botConfig = yield MongooseAutoRoleList.findById(event.guildId).exec();
            let needsUpdate = false;
            //Deletes listening info for message once its deleted
            for (const i in botConfig.roleChannels) {
                if (botConfig.roleChannels[i].id == event.channelId) {
                    const msgID = botConfig.roleChannels[i].messageIDs.indexOf(event.id);
                    if (msgID > -1) {
                        botConfig.roleChannels[i].messageIDs.splice(msgID, 1);
                        if (botConfig.roleChannels[i].messageIDs.length < 1) {
                            botConfig.roleChannels.splice(Number(i), 1);
                            botConfig.markModified('channelIDs');
                            needsUpdate = true;
                        }
                        else {
                            botConfig.markModified('channelIDs');
                            needsUpdate = true;
                        }
                    }
                }
            }
            if (needsUpdate) {
                yield botConfig.save().then(() => {
                    console.log(`Updated AutoRoleListeningDB for ${event.guildId}`);
                });
            }
        }));
        //#endregion
    });
}
//#endregion
//#region exports
export { autoRoleListener, generateEmbedFields };
//#endregion
