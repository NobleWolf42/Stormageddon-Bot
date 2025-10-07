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
import { embedCustomDM, errorCustom, warnDisabled } from '../../helpers/embedSlashMessages.js';
import { MongooseServerConfig } from '../../models/serverConfigModel.js';
import { MongooseTicketList } from '../../models/ticketingList.js';
//#endregion
//#region This exports the createrolemessage command with the information about it
const createRoleMessageSlashCommand = {
    data: new SlashCommandBuilder()
        .setName('createticketmessage')
        .setDescription('Creates the message for users to use to open a ticket.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const serverConfig = (yield MongooseServerConfig.findById(interaction.guildId).exec()).toObject();
            //Checks to see if the message title is set in the config
            if (!serverConfig.ticketing.embedTitle || serverConfig.ticketing.embedTitle === '') {
                errorCustom(interaction, `The 'embedTitle' property is not set! Please run the setup command again (${serverConfig.prefix}set ticketing).`, this.name, client);
                return;
            }
            //Checks to see is the message content is set in the config
            if (!serverConfig.ticketing.embedMessage || serverConfig.ticketing.embedMessage === '') {
                errorCustom(interaction, `The 'embedMessage' property is not set! Please run the setup command again (${serverConfig.prefix}set ticketing).`, this.name, client);
                return;
            }
            //Checks to see if the message footer is set in the config
            if (!serverConfig.ticketing.embedFooter || serverConfig.ticketing.embedFooter === '') {
                errorCustom(interaction, `The 'embedFooter' property is not set! Please run the setup command again (${serverConfig.prefix}set ticketing).`, this.name, client);
                return;
            }
            // Checks to see if the module is enabled
            if (!serverConfig.ticketing.enable) {
                warnDisabled(interaction, 'ticketing', this.name);
                return;
            }
            //#endregion
            //Pulls message listening info from db
            let botConfig = yield MongooseTicketList.findById(interaction.guildId).exec();
            if (botConfig == null) {
                botConfig = new MongooseTicketList();
                botConfig._id = interaction.guildId;
                botConfig.guildID = interaction.guildId;
                botConfig.ticketChannels.push({
                    id: channel.id,
                    messageIDs: [],
                });
                botConfig.markModified('_id');
                botConfig.markModified('guildID');
                botConfig.markModified('channelIDs');
            }
            let thumbnail = null;
            if (serverConfig.ticketing.embedThumbnail.enable && serverConfig.ticketing.embedThumbnail.url !== '') {
                thumbnail = serverConfig.ticketing.embedThumbnail.url;
            }
            else if (serverConfig.ticketing.embedThumbnail.enable && interaction.guild.icon) {
                thumbnail = interaction.guild.iconURL();
            }
            const embMsg = new EmbedBuilder()
                .setColor('#dd9323')
                .setDescription(serverConfig.ticketing.embedMessage)
                .setThumbnail(thumbnail)
                .setFooter({
                text: serverConfig.ticketing.embedFooter,
                iconURL: null,
            })
                .setTitle(serverConfig.ticketing.embedTitle)
                .setFields()
                .setTimestamp();
            const ticketChan = botConfig.ticketChannels.findIndex((test) => test.id == channel.id);
            const m = yield channel.send({ embeds: [embMsg] });
            if (botConfig.ticketChannels[ticketChan].messageIDs.find((test) => test == m.id) == undefined) {
                botConfig.ticketChannels[ticketChan].messageIDs.push(m.id);
                botConfig.markModified('channelIDs');
            }
            yield botConfig.save().then(() => {
                console.log(`Updated TicketingListeningDB for ${interaction.guildId}`);
                interaction.reply({
                    content: 'Command Run',
                    ephemeral: true,
                });
            });
        });
    },
};
//#endregion
//#region Exports
export default createRoleMessageSlashCommand;
//#endregion
