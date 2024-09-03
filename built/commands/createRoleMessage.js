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
import { MongooseServerConfig } from '../models/serverConfigModel.js';
import { MongooseAutoRoleList } from '../models/autoRoleList.js';
//#endregion
//#region This exports the createrolemessage command with the information about it
const createAutoRoleCommand = {
    name: 'createrolemessage',
    type: ['Guild'],
    aliases: ['creatermsg'],
    coolDown: 60,
    class: 'admin',
    usage: 'createrolemessage',
    description: 'Create the reactions message for auto role assignment.',
    execute(message, args, client, distube) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            //This is the max number of reactions on a message allowed by discord, if discord ever changes that number change this and the code should work again!!!
            var maxReactions = 20;
            var serverID = message.guild.id;
            const channel = message.channel;
            if (channel.isDMBased()) {
                return;
            }
            //Calls config from database
            var serverConfig = (yield MongooseServerConfig.findById(serverID).exec()).toObject();
            //Checks to make sure your roles and reactions match up
            if (serverConfig.autoRole.roles.length !== serverConfig.autoRole.reactions.length) {
                return errorCustom(message, `Roles list and reactions list are not the same length! Please run the setup command again (${serverConfig.prefix}set autorole).`, this.name, client);
            }
            // We don't want the bot to do anything further if it can't send messages in the channel
            if (message.guild && !message.guild.members.me.permissionsIn(message.channel.id).missing(PermissionsBitField.Flags.SendMessages)) {
                return embedCustomDM(message, 'Error', '#FF0000', "I don't have access to send messages in that channel, please give me permissions.");
            }
            const missing = message.guild.members.me.permissionsIn(message.channel.id).missing(PermissionsBitField.Flags.ManageMessages);
            // Here we check if the bot can actually add reactions in the channel the command is being ran in
            if (missing.includes('AddReactions')) {
                return errorCustom(message, `I need permission to add reactions to messages in this channel! Please assign the 'Add Reactions' permission to me in this channel!`, this.name, client);
            }
            if (!serverConfig.autoRole.embedMessage || serverConfig.autoRole.embedMessage === '') {
                return errorCustom(message, `The 'embedMessage' property is not set! Please run the setup command again (${serverConfig.prefix}set autorole).`, this.name, client);
            }
            else if (!serverConfig.autoRole.embedFooter || serverConfig.autoRole.embedFooter === '') {
                return errorCustom(message, `The 'embedFooter' property is not set! Please run the setup command again (${serverConfig.prefix}set autorole).`, this.name, client);
            }
            // Checks to see if the module is enabled
            if (!serverConfig.autoRole.enable) {
                return warnDisabled(message, 'autoRole', this.name);
            }
            // Checks that the user is an admin
            if (!adminCheck(message)) {
                return errorNoAdmin(message, this.name);
            }
            //Pulls message listening info from db
            let botConfig = yield MongooseAutoRoleList.findById(serverID).exec();
            if (botConfig == null) {
                botConfig = new MongooseAutoRoleList();
                botConfig._id = serverID;
                botConfig.guildID = serverID;
                botConfig.channelIDs.push([channel.id]);
                botConfig.markModified('_id');
                botConfig.markModified('guildID');
                botConfig.markModified('channelIDs');
            }
            let arrayKey = null;
            for (let i in botConfig.channelIDs) {
                if (botConfig.channelIDs[i][0] == channel.id) {
                    arrayKey = i;
                }
            }
            if (typeof botConfig.channelIDs == null || arrayKey == null) {
                arrayKey = (botConfig.channelIDs.push([channel.id]) - 1).toString();
            }
            var thumbnail = null;
            var fieldsOut = [];
            if (serverConfig.autoRole.embedThumbnail !== '') {
                thumbnail = serverConfig.autoRole.embedThumbnail;
            }
            else if (serverConfig.autoRole.embedThumbnail && message.guild.icon) {
                thumbnail = message.guild.iconURL();
            }
            const fields = yield generateEmbedFields(serverID);
            for (let { emoji, role } of fields) {
                if (!message.guild.roles.cache.find((r) => r.name === role)) {
                    return errorCustom(message, `The role '${role}' does not exist!! Please run the setup command again (${serverConfig.prefix}set autorole).`, this.name, client);
                }
                const customEmote = (_a = client.emojis.cache.find((e) => e.name === emoji)) === null || _a === void 0 ? void 0 : _a.id;
                if (!customEmote) {
                    fieldsOut.push({ name: emoji, value: role, inline: true });
                }
                else {
                    fieldsOut.push({
                        name: customEmote,
                        value: role,
                        inline: true,
                    });
                }
            }
            var count = 0;
            for (var i = 0; i < Math.ceil(fieldsOut.length / maxReactions); i++) {
                var embMsg = new EmbedBuilder()
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
                    var maxEmoji = 0;
                    if ((count + 1) * maxReactions < serverConfig.autoRole.reactions.length) {
                        maxEmoji = (count + 1) * maxReactions;
                    }
                    else {
                        maxEmoji = serverConfig.autoRole.reactions.length;
                    }
                    for (var r = count * maxReactions; r < maxEmoji; r++) {
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
                    console.log(arrayKey);
                    if (botConfig.channelIDs[arrayKey].find((test) => test == m.id) == undefined) {
                        botConfig.channelIDs[arrayKey].push(m.id);
                        botConfig.markModified('channelIDs');
                    }
                }));
            }
            message.delete();
            message.deleted = true;
            yield botConfig.save().then(() => {
                console.log(`Updated AutoRoleListeningDB for ${serverID}`);
            });
        });
    },
};
//#endregion
//#region Exports
export default createAutoRoleCommand;
//#endregion
