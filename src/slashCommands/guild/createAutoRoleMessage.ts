//#region Imports
import { APIEmbedField, EmbedBuilder, PermissionFlagsBits, PermissionsBitField, RestOrArray, SlashCommandBuilder } from 'discord.js';
import { embedCustomDM, errorCustom, warnDisabled } from '../../helpers/embedSlashMessages.js';
import { generateEmbedFields } from '../../internal/autoRole.js';
import { MongooseServerConfig } from '../../models/serverConfigModel.js';
import { SlashCommand } from '../../models/slashCommandModel.js';
import { MongooseAutoRoleList } from '../../models/autoRoleList.js';
//#endregion

//#region This exports the createrolemessage command with the information about it
const createRoleMessageSlashCommand: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('createrolemessage')
        .setDescription('Creates the reactions message for auto role assignment.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(client, interaction) {
        //This is the max number of reactions on a message allowed by discord, if discord ever changes that number change this and the code should work again!!!
        const maxReactions = 20;
        const channel = interaction.channel;

        //#region Escape Logic
        //Checks to see if message was sent in a guild
        if (channel.isDMBased() || !interaction.isChatInputCommand()) {
            return;
        }

        //Checks to see if the bot can send messages in the channel
        if (interaction.guild && !interaction.guild.members.me.permissionsIn(interaction.channel.id).missing(PermissionsBitField.Flags.SendMessages)) {
            embedCustomDM(interaction, 'Error', '#FF0000', "I don't have access to send messages in that channel, please give me permissions.", null, client);
            return;
        }

        // Here we check if the bot can actually add reactions in the channel the command is being ran in
        if (interaction.guild.members.me.permissionsIn(interaction.channel.id).missing(PermissionsBitField.Flags.ManageMessages).includes('AddReactions')) {
            errorCustom(interaction, `I need permission to add reactions to messages in this channel! Please assign the 'Add Reactions' permission to me in this channel!`, this.name, client);
            return;
        }

        const serverConfig = (await MongooseServerConfig.findById(interaction.guildId).exec()).toObject();

        //Checks to make sure your roles and reactions match up
        if (serverConfig.autoRole.roles.length !== serverConfig.autoRole.reactions.length) {
            errorCustom(interaction, `Roles list and reactions list are not the same length! Please run the setup command again (${serverConfig.prefix}set autorole).`, this.name, client);
            return;
        }

        //Checks to see is the message content is set in the config
        if (!serverConfig.autoRole.embedMessage || serverConfig.autoRole.embedMessage === '') {
            errorCustom(interaction, `The 'embedMessage' property is not set! Please run the setup command again (${serverConfig.prefix}set autorole).`, this.name, client);
            return;
        }

        //Checks to see if the message footer is set in the config
        if (!serverConfig.autoRole.embedFooter || serverConfig.autoRole.embedFooter === '') {
            errorCustom(interaction, `The 'embedFooter' property is not set! Please run the setup command again (${serverConfig.prefix}set autorole).`, this.name, client);
            return;
        }

        // Checks to see if the module is enabled
        if (!serverConfig.autoRole.enable) {
            warnDisabled(interaction, 'autoRole', this.name);
            return;
        }
        //#endregion

        //Pulls message listening info from db
        let botConfig = await MongooseAutoRoleList.findById(interaction.guildId).exec();
        if (botConfig == null) {
            botConfig = new MongooseAutoRoleList();
            botConfig._id = interaction.guildId;
            botConfig.guildID = interaction.guildId;
            botConfig.roleChannels.push({
                id: channel.id,
                messageIDs: [],
            });
            botConfig.markModified('_id');
            botConfig.markModified('guildID');
            botConfig.markModified('channelIDs');
        }

        let thumbnail: string = null;
        const fieldsOut: RestOrArray<APIEmbedField> = [];

        if (serverConfig.autoRole.embedThumbnail !== '') {
            thumbnail = serverConfig.autoRole.embedThumbnail;
        } else if (serverConfig.autoRole.embedThumbnail && interaction.guild.icon) {
            thumbnail = interaction.guild.iconURL();
        }

        const fields = await generateEmbedFields(serverConfig);

        for (const { emoji, role } of fields) {
            if (!interaction.guild.roles.cache.find((r) => r.name === role)) {
                errorCustom(interaction, `The role '${role}' does not exist!! Please run the setup command again (${serverConfig.prefix}set autorole).`, this.name, client);
                return;
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

            await channel.send({ embeds: [embMsg] }).then(async (m) => {
                let maxEmoji = 0;
                if ((count + 1) * maxReactions < serverConfig.autoRole.reactions.length) {
                    maxEmoji = (count + 1) * maxReactions;
                } else {
                    maxEmoji = serverConfig.autoRole.reactions.length;
                }

                for (let r = count * maxReactions; r < maxEmoji; r++) {
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

                if (botConfig.roleChannels[roleChan].messageIDs.find((test) => test == m.id) == undefined) {
                    botConfig.roleChannels[roleChan].messageIDs.push(m.id);
                    botConfig.markModified('channelIDs');
                }
            });
        }

        await botConfig.save().then(() => {
            console.log(`Updated AutoRoleListeningDB for ${interaction.guildId}`);
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
