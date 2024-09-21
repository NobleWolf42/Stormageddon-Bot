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
import { PermissionsBitField, EmbedBuilder } from 'discord.js';
import { warnDisabled, errorCustom, embedCustomDM } from '../helpers/embedMessages.js';
import { generateEmbedFields } from '../internal/autoRole.js';
import { errorNoAdmin } from '../helpers/embedMessages.js';
import { adminCheck } from '../helpers/userPermissions.js';
import { MongooseAutoRoleList } from '../models/autoRoleList.js';
//#endregion
//#region This creates the createrolemessage command with the information about it
const createRoleMessageCommand = {
    name: 'createrolemessage',
    type: ['Guild'],
    aliases: ['creatermsg'],
    coolDown: 60,
    class: 'admin',
    usage: 'createrolemessage',
    description: 'Create the reactions message for auto role assignment.',
    execute(message, _args, client, _distube, _collections, serverConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            //This is the max number of reactions on a message allowed by discord, if discord ever changes that number change this and the code should work again!!!
            const maxReactions = 20;
            const channel = message.channel;
            //#region Escape Logic
            //Checks to see if message was sent in a guild
            if (channel.isDMBased()) {
                return;
            }
            //Checks to make sure your roles and reactions match up
            if (serverConfig.autoRole.roles.length !== serverConfig.autoRole.reactions.length) {
                errorCustom(message, `Roles list and reactions list are not the same length! Please run the setup command again (${serverConfig.prefix}set autorole).`, this.name, client);
                return;
            }
            //Checks to see if the bot can send messages in the channel
            if (message.guild && !message.guild.members.me.permissionsIn(message.channel.id).missing(PermissionsBitField.Flags.SendMessages)) {
                embedCustomDM(message, 'Error', '#FF0000', "I don't have access to send messages in that channel, please give me permissions.");
                return;
            }
            // Here we check if the bot can actually add reactions in the channel the command is being ran in
            if (message.guild.members.me.permissionsIn(message.channel.id).missing(PermissionsBitField.Flags.ManageMessages).includes('AddReactions')) {
                errorCustom(message, `I need permission to add reactions to messages in this channel! Please assign the 'Add Reactions' permission to me in this channel!`, this.name, client);
                return;
            }
            //Checks to see is the message content is set in the config
            if (!serverConfig.autoRole.embedMessage || serverConfig.autoRole.embedMessage === '') {
                errorCustom(message, `The 'embedMessage' property is not set! Please run the setup command again (${serverConfig.prefix}set autorole).`, this.name, client);
                return;
            }
            //Checks to see if the message footer is set in the config
            if (!serverConfig.autoRole.embedFooter || serverConfig.autoRole.embedFooter === '') {
                errorCustom(message, `The 'embedFooter' property is not set! Please run the setup command again (${serverConfig.prefix}set autorole).`, this.name, client);
                return;
            }
            // Checks to see if the module is enabled
            if (!serverConfig.autoRole.enable) {
                warnDisabled(message, 'autoRole', this.name);
                return;
            }
            // Checks that the user is an admin
            if (!adminCheck(message, serverConfig)) {
                errorNoAdmin(message, this.name);
                return;
            }
            //#endregion
            //Pulls message listening info from db
            let botConfig = yield MongooseAutoRoleList.findById(message.guildId).exec();
            if (botConfig == null) {
                botConfig = new MongooseAutoRoleList();
                botConfig._id = message.guildId;
                botConfig.guildID = message.guildId;
                botConfig.roleChannels.push({
                    id: channel.id,
                    messageIDs: [],
                });
                botConfig.markModified('_id');
                botConfig.markModified('guildID');
                botConfig.markModified('channelIDs');
            }
            let thumbnail = null;
            const fieldsOut = [];
            if (serverConfig.autoRole.embedThumbnail.enable && serverConfig.autoRole.embedThumbnail.url != '') {
                thumbnail = serverConfig.autoRole.embedThumbnail.url;
            }
            else if (serverConfig.autoRole.embedThumbnail.enable && message.guild.icon) {
                thumbnail = message.guild.iconURL();
            }
            const fields = yield generateEmbedFields(serverConfig);
            for (const { emoji, role } of fields) {
                const roleObject = yield message.guild.roles.fetch(role);
                if (!roleObject) {
                    errorCustom(message, `The role '${role}' does not exist!! Please run the setup command again (${serverConfig.prefix}set autorole).`, this.name, client);
                    return;
                }
                const customEmote = (_a = client.emojis.cache.find((e) => e.name === emoji)) === null || _a === void 0 ? void 0 : _a.id;
                if (!customEmote) {
                    fieldsOut.push({ name: emoji, value: roleObject.name, inline: true });
                }
                else {
                    fieldsOut.push({
                        name: customEmote,
                        value: roleObject.name,
                        inline: true,
                    });
                }
            }
            let count = 0;
            const roleChan = botConfig.roleChannels.findIndex((test) => test.id == channel.id);
            for (let i = 0; i < Math.ceil(fieldsOut.length / maxReactions); i++) {
                const embMsg = new EmbedBuilder()
                    .setColor('#dd9323')
                    .setDescription(serverConfig.autoRole.embedMessage)
                    .setThumbnail(thumbnail)
                    .setFooter({
                    text: serverConfig.autoRole.embedFooter,
                    iconURL: null,
                })
                    .setTitle(`Role Message - ${i + 1} out of ${Math.ceil(fieldsOut.length / maxReactions)}`)
                    .setFields(fieldsOut.slice(i * maxReactions, (i + 1) * maxReactions))
                    .setTimestamp();
                yield channel.send({ embeds: [embMsg] }).then((m) => __awaiter(this, void 0, void 0, function* () {
                    let maxEmoji = 0;
                    if ((count + 1) * maxReactions < serverConfig.autoRole.reactions.length) {
                        maxEmoji = (count + 1) * maxReactions;
                    }
                    else {
                        maxEmoji = serverConfig.autoRole.reactions.length;
                    }
                    for (let r = count * maxReactions; r < maxEmoji; r++) {
                        if (r == count * maxReactions) {
                            count++;
                        }
                        const emoji = serverConfig.autoRole.reactions[r];
                        const customCheck = client.emojis.cache.find((e) => e.name === emoji);
                        if (!customCheck) {
                            yield m.react(emoji);
                        }
                        else {
                            yield m.react(customCheck.id);
                        }
                    }
                    if (roleChan < 0) {
                        botConfig.roleChannels.push({ id: channel.id, messageIDs: [] });
                    }
                    else if (botConfig.roleChannels[roleChan].messageIDs.find((test) => test == m.id) == undefined) {
                        botConfig.roleChannels[roleChan].messageIDs.push(m.id);
                        botConfig.markModified('channelIDs');
                    }
                }));
            }
            message.delete();
            message.deleted = true;
            yield botConfig.save().then(() => {
                console.log(`Updated AutoRoleListeningDB for ${message.guildId}`);
            });
        });
    },
};
//#endregion
//#region Exports
export default createRoleMessageCommand;
//#endregion
