//#region Imports
import { PermissionsBitField, EmbedBuilder, RestOrArray, APIEmbedField, Message } from 'discord.js';
import { warnDisabled, errorCustom, embedCustomDM } from '../helpers/embedMessages.js';
import { generateEmbedFields } from '../internal/autoRole.js';
import { errorNoAdmin } from '../helpers/embedMessages.js';
import { adminCheck } from '../helpers/userPermissions.js';
import { Command } from '../models/commandModel.js';
import { MongooseServerConfig } from '../models/serverConfigModel.js';
import { MongooseAutoRoleList } from '../models/autoRoleList.js';
//#endregion

//#region This exports the createrolemessage command with the information about it
const createAutoRoleCommand: Command = {
    name: 'createrolemessage',
    type: ['Guild'],
    aliases: ['creatermsg'],
    coolDown: 60,
    class: 'admin',
    usage: 'createrolemessage',
    description: 'Create the reactions message for auto role assignment.',
    async execute(message, args, client, distube) {
        //This is the max number of reactions on a message allowed by discord, if discord ever changes that number change this and the code should work again!!!
        var maxReactions = 20;

        var serverID = message.guild.id;
        const channel = message.channel;

        if (channel.isDMBased()) {
            return;
        }

        //Calls config from database
        var serverConfig = (await MongooseServerConfig.findById(serverID).exec()).toObject();

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
        } else if (!serverConfig.autoRole.embedFooter || serverConfig.autoRole.embedFooter === '') {
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
        let botConfig = await MongooseAutoRoleList.findById(serverID).exec();
        if (botConfig == null) {
            botConfig = new MongooseAutoRoleList();
            botConfig._id = serverID;
            botConfig.guildID = serverID;
            botConfig.channelIDs.push([channel.id]);
            botConfig.markModified('_id');
            botConfig.markModified('guildID');
            botConfig.markModified('channelIDs');
        }

        let arrayKey: string = null;
        for (let i in botConfig.channelIDs) {
            if (botConfig.channelIDs[i][0] == channel.id) {
                arrayKey = i;
            }
        }

        if (typeof botConfig.channelIDs == null || arrayKey == null) {
            arrayKey = (botConfig.channelIDs.push([channel.id]) - 1).toString();
        }

        var thumbnail: string = null;
        var fieldsOut: RestOrArray<APIEmbedField> = [];

        if (serverConfig.autoRole.embedThumbnail !== '') {
            thumbnail = serverConfig.autoRole.embedThumbnail;
        } else if (serverConfig.autoRole.embedThumbnail && message.guild.icon) {
            thumbnail = message.guild.iconURL();
        }

        const fields = await generateEmbedFields(serverID);

        for (let { emoji, role } of fields) {
            if (!message.guild.roles.cache.find((r) => r.name === role)) {
                return errorCustom(message, `The role '${role}' does not exist!! Please run the setup command again (${serverConfig.prefix}set autorole).`, this.name, client);
            }

            const customEmote = client.emojis.cache.find((e) => e.name === emoji)?.id;

            if (!customEmote) {
                fieldsOut.push({ name: emoji, value: role, inline: true });
            } else {
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

            await channel.send({ embeds: [embMsg] }).then(async (m) => {
                var maxEmoji = 0;
                if ((count + 1) * maxReactions < serverConfig.autoRole.reactions.length) {
                    maxEmoji = (count + 1) * maxReactions;
                } else {
                    maxEmoji = serverConfig.autoRole.reactions.length;
                }

                for (var r = count * maxReactions; r < maxEmoji; r++) {
                    if (r == count * maxReactions) {
                        count++;
                    }

                    const emoji = serverConfig.autoRole.reactions[r];
                    const customCheck = client.emojis.cache.find((e) => e.name === emoji);

                    if (!customCheck) {
                        await m.react(emoji);
                    } else {
                        await m.react(customCheck.id);
                    }
                }
                console.log(arrayKey);
                if (botConfig.channelIDs[arrayKey].find((test) => test == m.id) == undefined) {
                    botConfig.channelIDs[arrayKey].push(m.id);
                    botConfig.markModified('channelIDs');
                }
            });
        }

        message.delete();
        message.deleted = true;
        await botConfig.save().then(() => {
            console.log(`Updated AutoRoleListeningDB for ${serverID}`);
        });
    },
};
//#endregion

//#region Exports
export default createAutoRoleCommand;
//#endregion
