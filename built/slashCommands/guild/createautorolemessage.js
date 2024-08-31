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
const { PermissionsBitField, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, } = require('discord.js');
//#endregion
//#region Helpers
const { updateConfigFile } = require('../../helpers/currentSettings.js');
const { warnDisabled, errorNoAdmin, } = require('../../helpers/embedSlashMessages.js');
const { adminCheck } = require('../../helpers/userPermissions.js');
//#endregion
//#region Internals
const { generateEmbedFields } = require('../../internal/autoRole.js');
//#endregion
//#region This exports the createrolemessage command with the information about it
module.exports = {
    data: new SlashCommandBuilder()
        .setName('createrolemessage')
        .setDescription('Creates the reactions message for auto role assignment.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    execute(client, interaction, distube) {
        return __awaiter(this, void 0, void 0, function* () {
            //This is the max number of reactions on a message allowed by discord, if discord ever changes that number change this and the code should work again!!!
            var maxReactions = 20;
            //Setting some variables for ease later
            var serverID = interaction.guildId;
            var channel = yield client.channels.fetch(interaction.channelId);
            config = updateConfigFile();
            //Checks to make sure your roles and reactions match up
            if (config[serverID].autoRole.roles.length !==
                config[serverID].autoRole.reactions.length) {
                throw new Error('Roles list and reactions list are not the same length! Please double check this in the config[serverID].js file');
            }
            // We don't want the bot to do anything further if it can't send messages in the channel
            if (interaction.guild &&
                !interaction.guild.members.me
                    .permissionsIn(channel.id)
                    .missing(PermissionsBitField.Flags.SendMessages))
                return;
            const missing = interaction.guild.members.me
                .permissionsIn(channel.id)
                .missing(PermissionsBitField.Flags.ManageMessages);
            // Here we check if the bot can actually add reactions in the channel the command is being ran in
            if (missing.includes('ADD_REACTIONS'))
                throw new Error("I need permission to add reactions to these messages! Please assign the 'Add Reactions' permission to me in this channel!");
            if (!config[serverID].autoRole.embedMessage ||
                config[serverID].autoRole.embedMessage === '')
                throw "The 'embedMessage' property is not set in the config[serverID].js file. Please do this!";
            if (!config[serverID].autoRole.embedFooter ||
                config[serverID].autoRole.embedMessage === '')
                throw "The 'embedFooter' property is not set in the config[serverID].js file. Please do this!";
            // Checks to see if the module is enabled
            if (!config[serverID].autoRole.enable) {
                return warnDisabled(interaction, 'autoRole', module.name);
            }
            // Checks that the user is an admin
            if (!adminCheck(interaction)) {
                return errorNoAdmin(interaction, module.name);
            }
            var thumbnail = null;
            var fieldsOut = [];
            if (config[serverID].autoRole.embedThumbnail &&
                config[serverID].autoRole.embedThumbnailLink !== '') {
                thumbnail = config[serverID].autoRole.embedThumbnailLink;
            }
            else if (config[serverID].autoRole.embedThumbnail &&
                interaction.guild.icon) {
                thumbnail = interaction.guild.iconURL;
            }
            const fields = generateEmbedFields(serverID);
            for (const { emoji, role } of fields) {
                if (!interaction.guild.roles.cache.find((r) => r.name === role))
                    throw `The role '${role}' does not exist!`;
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
                var embMsg = new EmbedBuilder();
                embMsg.setColor('#dd9323');
                embMsg.setDescription(config[serverID].autoRole.embedMessage);
                embMsg.setThumbnail(thumbnail);
                embMsg.setFooter({
                    text: config[serverID].autoRole.embedFooter,
                    iconURL: null,
                });
                embMsg.setTitle(`Role Message - ${i + 1} out of ${Math.ceil(fieldsOut.length / maxReactions)}`);
                embMsg.setFields(fieldsOut.slice(i * maxReactions, (i + 1) * maxReactions));
                embMsg.setTimestamp();
                channel.send({ embeds: [embMsg] }).then((m) => __awaiter(this, void 0, void 0, function* () {
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
            interaction.reply({
                content: 'Command Run',
                ephemeral: true,
            });
        });
    },
};
//#endregion
