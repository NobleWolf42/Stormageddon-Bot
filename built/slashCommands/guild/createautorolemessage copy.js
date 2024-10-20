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
import { EmbedBuilder, PermissionFlagsBits, PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import { errorNoAdmin, warnDisabled } from '../../helpers/embedSlashMessages.js';
import { adminCheck } from '../../helpers/userSlashPermissions.js';
import { generateEmbedFields } from '../../internal/autoRole.js';
import { MongooseServerConfig } from '../../models/serverConfigModel.js';
//#endregion
//#region This exports the createrolemessage command with the information about it
const createRoleMessageSlashCommand = {
    data: new SlashCommandBuilder()
        .setName('createrolemessage')
        .setDescription('Creates the reactions message for auto role assignment.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            //This is the max number of reactions on a message allowed by discord, if discord ever changes that number change this and the code should work again!!!
            const maxReactions = 20;
            //#region Escape
            if (!interaction.isChatInputCommand()) {
                return;
            }
            const channel = yield client.channels.fetch(interaction.channelId);
            // We don't want the bot to do anything further if it can't send messages in the channel
            if ((interaction.guild && !interaction.guild.members.me.permissionsIn(channel.id).missing(PermissionsBitField.Flags.SendMessages)) || !channel.isTextBased() || channel.isDMBased()) {
                return;
            }
            const missing = interaction.guild.members.me.permissionsIn(channel.id).missing(PermissionsBitField.Flags.ManageMessages);
            // Here we check if the bot can actually add reactions in the channel the command is being ran in
            if (missing.includes('AddReactions'))
                throw new Error("I need permission to add reactions to these messages! Please assign the 'Add Reactions' permission to me in this channel!");
            const serverConfig = (yield MongooseServerConfig.findById(interaction.guildId).exec()).toObject();
            //Checks to make sure your roles and reactions match up
            if (serverConfig.autoRole.roles.length !== serverConfig.autoRole.reactions.length) {
                throw new Error('Roles list and reactions list are not the same length! Please double check this in the serverConfig.js file');
            }
            if (!serverConfig.autoRole.embedMessage || serverConfig.autoRole.embedMessage === '')
                throw "The 'embedMessage' property is not set in the serverConfig.js file. Please do this!";
            if (!serverConfig.autoRole.embedFooter || serverConfig.autoRole.embedMessage === '')
                throw "The 'embedFooter' property is not set in the serverConfig.js file. Please do this!";
            // Checks to see if the module is enabled
            if (!serverConfig.autoRole.enable) {
                return warnDisabled(interaction, 'autoRole', createRoleMessageSlashCommand.data.name);
            }
            // Checks that the user is an admin
            if (!adminCheck(interaction, serverConfig)) {
                return errorNoAdmin(interaction, createRoleMessageSlashCommand.data.name);
            }
            //#endregion
            let thumbnail = null;
            const fieldsOut = [];
            if (serverConfig.autoRole.embedThumbnail !== '') {
                thumbnail = serverConfig.autoRole.embedThumbnail;
            }
            else if (serverConfig.autoRole.embedThumbnail && interaction.guild.icon) {
                thumbnail = interaction.guild.iconURL();
            }
            const fields = yield generateEmbedFields(serverConfig);
            for (const { emoji, role } of fields) {
                if (!interaction.guild.roles.cache.find((r) => r.name === role))
                    throw `The role '${role}' does not exist!`;
                const customEmote = client.emojis.cache.find((e) => e.name === emoji);
                if (!customEmote) {
                    fieldsOut.push({ name: emoji, value: role, inline: true });
                }
                else {
                    fieldsOut.push({
                        name: customEmote.toString(),
                        value: role,
                        inline: true,
                    });
                }
            }
            let count = 0;
            for (let i = 0; i < Math.ceil(fieldsOut.length / maxReactions); i++) {
                const embMsg = new EmbedBuilder();
                embMsg.setColor('#dd9323');
                embMsg.setDescription(serverConfig.autoRole.embedMessage);
                embMsg.setThumbnail(thumbnail);
                embMsg.setFooter({
                    text: serverConfig.autoRole.embedFooter,
                    iconURL: null,
                });
                embMsg.setTitle(`Role Message - ${i + 1} out of ${Math.ceil(fieldsOut.length / maxReactions)}`);
                embMsg.setFields(fieldsOut.slice(i * maxReactions, (i + 1) * maxReactions));
                embMsg.setTimestamp();
                channel.send({ embeds: [embMsg] }).then((m) => __awaiter(this, void 0, void 0, function* () {
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
//#region Exports
export default createRoleMessageSlashCommand;
//#endregion
