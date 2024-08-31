var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//#region Dependencies
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
//#endregion
//#region Helpers
const { updateConfigFile } = require('../helpers/currentSettings.js');
const { warnDisabled, errorCustom, embedCustomDM, } = require('../helpers/embedMessages.js');
//#endregion
//#region Internals
const { generateEmbedFields } = require('../internal/autoRole.js');
const { errorNoAdmin } = require('../helpers/embedMessages.js');
const { adminCheck } = require('../helpers/userPermissions.js');
//#endregion
//#region This exports the createrolemessage command with the information about it
module.exports = {
    name: 'createrolemessage',
    type: ['Guild'],
    aliases: ['creatermsg'],
    coolDown: 60,
    class: 'admin',
    usage: 'createrolemessage',
    description: 'Create the reactions message for auto role assignment.',
    execute(message, args, client, distube) {
        //This is the max number of reactions on a message allowed by discord, if discord ever changes that number change this and the code should work again!!!
        var maxReactions = 20;
        var serverID = message.guild.id;
        config = updateConfigFile();
        //Checks to make sure your roles and reactions match up
        if (config[serverID].autoRole.roles.length !==
            config[serverID].autoRole.reactions.length) {
            return errorCustom(message, `Roles list and reactions list are not the same length! Please run the setup command again (${message.prefix}set autorole).`, module.name, client);
        }
        // We don't want the bot to do anything further if it can't send messages in the channel
        if (message.guild &&
            !message.guild.members.me
                .permissionsIn(message.channel.id)
                .missing(PermissionsBitField.Flags.SendMessages)) {
            return embedCustomDM(message, 'Error', '#FF0000', "I don't have access to send messages in that channel, please give me permissions.");
        }
        const missing = message.guild.members.me
            .permissionsIn(message.channel.id)
            .missing(PermissionsBitField.Flags.ManageMessages);
        // Here we check if the bot can actually add reactions in the channel the command is being ran in
        if (missing.includes('ADD_REACTIONS')) {
            return errorCustom(message, `I need permission to add reactions to messages in this channel! Please assign the 'Add Reactions' permission to me in this channel!`, module.name, client);
        }
        if (!config[serverID].autoRole.embedMessage ||
            config[serverID].autoRole.embedMessage === '') {
            return errorCustom(message, `The 'embedMessage' property is not set! Please run the setup command again (${message.prefix}set autorole).`, module.name, client);
        }
        else if (!config[serverID].autoRole.embedFooter ||
            config[serverID].autoRole.embedFooter === '') {
            return errorCustom(message, `The 'embedFooter' property is not set! Please run the setup command again (${message.prefix}set autorole).`, module.name, client);
        }
        // Checks to see if the module is enabled
        if (!config[serverID].autoRole.enable) {
            return warnDisabled(message, 'autoRole', module.name);
        }
        // Checks that the user is an admin
        if (!adminCheck(message)) {
            return errorNoAdmin(message, module.name);
        }
        var thumbnail = null;
        var fieldsOut = [];
        if (config[serverID].autoRole.embedThumbnail &&
            config[serverID].autoRole.embedThumbnailLink !== '') {
            thumbnail = config[serverID].autoRole.embedThumbnailLink;
        }
        else if (config[serverID].autoRole.embedThumbnail &&
            message.guild.icon) {
            thumbnail = message.guild.iconURL;
        }
        const fields = generateEmbedFields(serverID);
        for (const { emoji, role } of fields) {
            if (!message.guild.roles.cache.find((r) => r.name === role)) {
                return errorCustom(message, `The role '${role}' does not exist!! Please run the setup command again (${message.prefix}set autorole).`, module.name, client);
            }
            const customEmote = client.emojis.cache.find((e) => e.name === emoji);
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
                .setDescription(config[serverID].autoRole.embedMessage)
                .setThumbnail(thumbnail)
                .setFooter({
                text: config[serverID].autoRole.embedFooter,
                iconURL: null,
            })
                .setTitle(`Role Message - ${i + 1} out of ${Math.ceil(fieldsOut.length / maxReactions)}`)
                .setFields(fieldsOut.slice(i * maxReactions, (i + 1) * maxReactions))
                .setTimestamp();
            message.channel.send({ embeds: [embMsg] }).then((m) => __awaiter(this, void 0, void 0, function* () {
                var maxEmoji = 0;
                if ((count + 1) * maxReactions <
                    config[serverID].autoRole.reactions.length) {
                    maxEmoji = (count + 1) * maxReactions;
                }
                else {
                    maxEmoji = config[serverID].autoRole.reactions.length;
                }
                for (var r = count * maxReactions; r < maxEmoji; r++) {
                    if (r == count * maxReactions) {
                        count++;
                    }
                    const emoji = config[serverID].autoRole.reactions[r];
                    const customCheck = client.emojis.cache.find((e) => e.name === emoji);
                    if (!customCheck) {
                        yield m.react(emoji);
                    }
                    else {
                        yield m.react(customCheck.id);
                    }
                }
            }));
        }
        message.delete();
        message.deleted = true;
    },
};
export {};
//#endregion
