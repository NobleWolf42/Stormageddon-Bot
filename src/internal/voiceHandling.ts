//#region Imports
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelType,
    Client,
    ComponentType,
    EmbedBuilder,
    Events,
    Message,
    ModalBuilder,
    PermissionFlagsBits,
    SelectMenuComponentOptionData,
    StringSelectMenuBuilder,
    TextInputBuilder,
    TextInputStyle,
    VoiceChannel,
} from 'discord.js';
import { Document } from 'mongoose';
import { addToLog } from '../helpers/errorLog.js';
import { modCheck } from '../helpers/userPermissions.js';
import { ExtraCollections } from '../models/extraCollectionsModel.js';
import { ButtonAction, ModalAction, SelectAction, TextAction } from '../models/inputEnum.js';
import { JTCVCList, MongooseJTCVCList } from '../models/jtcvcList.js';
import { LogType } from '../models/loggingModel.js';
import { MongooseServerConfig, ServerConfig } from '../models/serverConfigModel.js';
//#endregion

//#region Function that starts the listener that handles Join to Create Channels
/**
 * This function starts the listener that handles that handles Join to Create Channels.
 * @param client - Discord.js Client Object
 * @param collections - Class containing all the extra collections for the bot
 */
async function joinToCreateHandling(client: Client, collections: ExtraCollections) {
    const jtcvcLists = await MongooseJTCVCList.find({}).exec();

    for (const channel of jtcvcLists) {
        const channelObj = await client.channels.fetch(channel.id).catch((err) => {
            console.log(err.message);
        });
        if (!channelObj || !channelObj.isVoiceBased() || channelObj.members.size < 1) {
            if (channelObj && channelObj.isVoiceBased() && channelObj.members.size < 1) {
                channelObj.delete();
            }
            channel.deleteOne().exec();
        } else {
            collections.voiceGenerator.set(channel.id, channel.memberID);
        }
    }

    //This handles the event of a user joining or disconnecting from a voice channel
    client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
        const { member, guild } = newState;
        const serverID = guild.id;
        const oldChannel = oldState.channel;
        const newChannel = newState.channel;
        // eslint-disable-next-line
        let channelList: Document<unknown, {}, JTCVCList> &
            JTCVCList &
            Required<{
                _id: string;
            }> = null;

        if (oldChannel == newChannel) {
            return;
        }

        //#region Handles someone leaving a voice channel
        try {
            if (oldChannel != null) {
                if (collections.voiceGenerator.get(oldChannel.id) && oldChannel.members.size == 0) {
                    //This deletes a channel if it was created byt the bot and is empty
                    channelList = await MongooseJTCVCList.findById(oldChannel.id).exec();
                    oldChannel.delete();
                    channelList.deleteOne().exec();
                    collections.voiceGenerator.delete(oldChannel.id);
                }
            }
        } catch (err) {
            addToLog(LogType.FatalError, 'JTCVC Handler', member.user.tag, guild.name, oldChannel.name, err, client);
        }
        //#endregion
        //Calls serverConfig from database
        const serverConfig = (await MongooseServerConfig.findById(serverID).exec()).toObject();

        if (serverConfig.setupNeeded) {
            return;
        }

        //#region Handles someone joining the JTC VC
        if (serverConfig.JTCVC.enable && newChannel && newChannel.id === serverConfig.JTCVC.voiceChannel) {
            //Creates new voice channel
            const voiceChannel = await guild.channels.create({
                name: `${member.user.tag}'s Channel`,
                type: ChannelType.GuildVoice,
                parent: newChannel.parent,
                permissionOverwrites: newChannel.parent.permissionOverwrites.cache.map((p) => {
                    return {
                        id: p.id,
                        allow: p.allow.toArray(),
                        deny: p.deny.toArray(),
                    };
                }),
            });

            panelCreation(voiceChannel, collections, serverConfig);

            //Adds the voice channel just made to the collection
            collections.voiceGenerator.set(voiceChannel.id, member.id);
            channelList = await MongooseJTCVCList.findById(voiceChannel.id).exec();
            if (channelList == null) {
                channelList = new MongooseJTCVCList();
                channelList._id = voiceChannel.id;
                channelList.memberID = member.id;
                channelList.markModified('_id');
                channelList.markModified('memberID');
            }
            channelList.save();

            //Times the user out from spamming new voice channels, currently set to 10 seconds and apparently works intermittently, probably due to the permissions when testing it
            await newChannel.permissionOverwrites.set([
                {
                    id: member.id,
                    deny: [PermissionFlagsBits.Connect],
                },
            ]);
            setTimeout(() => newChannel.permissionOverwrites.delete(member), 10 * 1000);

            return member.voice.setChannel(voiceChannel);
        }

        //#endregion
    });

    console.log('... OK');
}
//#endregion

//#region Panel Creation
/**
 * This function starts the listener that handles that handles Join to Create Channels.
 * @param channel - Current Discord.js VoiceChannel Object
 * @param collections - Current ExtraCollections Object
 * @param serverConfig - Current Server Config File
 */
async function panelCreation(channel: VoiceChannel, collections: ExtraCollections, serverConfig: ServerConfig) {
    const embMsg = new EmbedBuilder()
        .setTitle('Voice Channel Controls')
        .setColor('#00A0FF')
        .setDescription(`Temporary Channel\nUse the buttons below to moderate your temporary voice channel!\nYou can also use slash '/' commands.`)
        .setTimestamp();
    //#region button creation
    //#region buttons row1
    const vChannelPrivate = new ButtonBuilder().setCustomId(ButtonAction.VCPrivate).setLabel('🚫 Set Private').setStyle(ButtonStyle.Secondary);
    const vChannelPublic = new ButtonBuilder().setCustomId(ButtonAction.VCPublic).setLabel('🌐 Set Public').setStyle(ButtonStyle.Secondary);
    const vChannelHide = new ButtonBuilder().setCustomId(ButtonAction.VCHide).setLabel('🙈 Hide Channel').setStyle(ButtonStyle.Secondary);
    const vChannelShow = new ButtonBuilder().setCustomId(ButtonAction.VCShow).setLabel('🐵 Show Channel').setStyle(ButtonStyle.Secondary);
    //#endregion
    //#region buttons row2
    const vChannelEdit = new ButtonBuilder().setCustomId(ButtonAction.VCEdit).setLabel('✏️ Edit Channel Name').setStyle(ButtonStyle.Secondary);
    const vChannelKick = new ButtonBuilder().setCustomId(ButtonAction.VCKick).setLabel('👟 Kick User').setStyle(ButtonStyle.Secondary);
    const vChannelBan = new ButtonBuilder().setCustomId(ButtonAction.VCBan).setLabel('⛔ Ban User').setStyle(ButtonStyle.Secondary);
    //#endregion
    //#region buttons row3
    const vChannelChangeOwner = new ButtonBuilder().setCustomId(ButtonAction.VCNewOwner).setLabel('👑 Change Owner').setStyle(ButtonStyle.Secondary);
    const vChannelClaimChannel = new ButtonBuilder().setCustomId(ButtonAction.VCClaim).setLabel('🌌 Claim Channel').setStyle(ButtonStyle.Secondary);
    //#endregion
    const buttons1 = new ActionRowBuilder<ButtonBuilder>().addComponents(vChannelPrivate, vChannelPublic, vChannelHide, vChannelShow);
    const buttons2 = new ActionRowBuilder<ButtonBuilder>().addComponents(vChannelEdit, vChannelKick, vChannelBan);
    const buttons3 = new ActionRowBuilder<ButtonBuilder>().addComponents(vChannelChangeOwner, vChannelClaimChannel);
    //#endregion

    const panelMessage = await channel.send({
        embeds: [embMsg],
        components: [buttons1, buttons2, buttons3],
    });

    panelCollector(panelMessage, collections, serverConfig);
}
//#endregion

//#region Panel Listener
/**
 * This function starts the listener that handles that handles Join to Create Channels.
 * @param message - The Discord.JS Message Object for the Panel Message
 * @param collections - Current ExtraCollections Object
 * @param serverConfig - Current Server Config File
 */
function panelCollector(message: Message, collections: ExtraCollections, serverConfig: ServerConfig) {
    const collector = message.createMessageComponentCollector({
        componentType: ComponentType.Button,
    });
    collector.on('collect', async (interaction: ButtonInteraction) => {
        const channel = message.channel;
        if (!channel.isVoiceBased()) {
            return;
        }
        const embMsg = new EmbedBuilder().setColor('#10FFAB').setTimestamp();

        if (collections.voiceGenerator.get(channel.id) != interaction.user.id && interaction.customId != ButtonAction.VCClaim) {
            embMsg.setTitle('Error').setDescription('You are not the channel owner.');
            interaction.reply({ embeds: [embMsg], ephemeral: true });
        }

        switch (interaction.customId) {
            //#region on button press - Private
            case ButtonAction.VCPrivate:
                for (const permission of channel.permissionOverwrites.cache) {
                    channel.permissionOverwrites.edit(permission[0], { Connect: false });
                }
                channel.permissionOverwrites.edit(interaction.user.id, { Connect: true });
                embMsg.setTitle('Channel Set to Private').setDescription('Successful');
                interaction.reply({ embeds: [embMsg], ephemeral: true });
                break;
            //#endregion

            //#region on button press - Public
            case ButtonAction.VCPublic:
                for (const permission of channel.parent.permissionOverwrites.cache) {
                    if (permission[1].allow.has(PermissionFlagsBits.Connect)) {
                        channel.permissionOverwrites.edit(permission[0], { Connect: true });
                    }
                }
                embMsg.setTitle('Channel set to Public').setDescription('Successful');
                interaction.reply({ embeds: [embMsg], ephemeral: true });
                break;
            //#endregion

            //#region on button press - Hide
            case ButtonAction.VCHide:
                for (const permission of channel.permissionOverwrites.cache) {
                    channel.permissionOverwrites.edit(permission[0], { ViewChannel: false });
                }
                channel.permissionOverwrites.edit(interaction.user.id, { ViewChannel: true });
                embMsg.setTitle('Channel hidden').setDescription('Successful');
                interaction.reply({ embeds: [embMsg], ephemeral: true });
                break;
            //#endregion

            //#region on button press - Show
            case ButtonAction.VCShow:
                for (const permission of channel.parent.permissionOverwrites.cache) {
                    if (permission[1].allow.has(PermissionFlagsBits.ViewChannel)) {
                        channel.permissionOverwrites.edit(permission[0], { ViewChannel: true });
                    }
                }
                embMsg.setTitle('Channel Shown').setDescription('Successful');
                interaction.reply({ embeds: [embMsg], ephemeral: true });
                break;
            //#endregion

            //#region on button press - Edit
            case ButtonAction.VCEdit:
                {
                    const VCNewNameBody = new TextInputBuilder().setCustomId(TextAction.VCNewName).setLabel('Input Channel Name:').setValue(channel.name).setStyle(TextInputStyle.Short);

                    const VCNewNameBodyInput = new ActionRowBuilder<TextInputBuilder>().addComponents(VCNewNameBody);
                    const VCNewNameModal = new ModalBuilder().setCustomId(ModalAction.VCNameModal).setTitle('Channel Name').addComponents(VCNewNameBodyInput);

                    await interaction.showModal(VCNewNameModal);
                    await interaction.awaitModalSubmit({ time: 60000 }).then(async (VCTextInteraction) => {
                        if (VCTextInteraction.customId != ModalAction.VCNameModal) {
                            return;
                        }

                        if (collections.voiceChanges.get(channel.id) > 1) {
                            embMsg.setTitle('Error changing title').setDescription("Due to how discord's API works, you can only change the channel name twice every ten minutes.").setColor('#F8AA2A');
                            VCTextInteraction.reply({ embeds: [embMsg], ephemeral: true });
                            return;
                        }
                        channel.edit({ name: VCTextInteraction.fields.getField(TextAction.VCNewName).value });
                        let changes = 0;
                        if (!isNaN(collections.voiceChanges.get(channel.id))) {
                            changes = collections.voiceChanges.get(channel.id);
                        }
                        collections.voiceChanges.set(channel.id, changes + 1);
                        setTimeout(() => {
                            collections.voiceChanges.set(channel.id, collections.voiceChanges.get(channel.id) - 1);
                        }, 600000);

                        embMsg.setTitle(`Title set to ${VCTextInteraction.fields.getField(TextAction.VCNewName).value}`).setDescription('Successful');
                        VCTextInteraction.reply({ embeds: [embMsg], ephemeral: true });
                    });
                    interaction.deferReply();
                }
                break;
            //#endregion

            //#region on button press - Kick
            case ButtonAction.VCKick: {
                const stringSelect: SelectMenuComponentOptionData[] = [];
                let numberOfOptions = 0;
                for (const [id, member] of channel.members) {
                    stringSelect.push({ label: member.user.tag, value: id });
                    if (numberOfOptions < 10) {
                        numberOfOptions++;
                    }
                }
                const embMsgKick = new EmbedBuilder().setTitle('Kick users').setDescription('Select up to 10 users to kick them from the voice chat.').setColor('#00A0FF');
                const VCKickUserMenu = new StringSelectMenuBuilder().setCustomId(SelectAction.VCKickUser).setMinValues(1).setMaxValues(numberOfOptions).addOptions(stringSelect);
                await interaction.deferReply({ ephemeral: true });
                const VCSelect = await interaction.followUp({ embeds: [embMsgKick], components: [new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(VCKickUserMenu)] });

                await VCSelect.awaitMessageComponent<ComponentType.StringSelect>().then(async (VCKickInteraction) => {
                    const modList: string[] = [];
                    const userList: string[] = [];
                    for (const id of VCKickInteraction.values) {
                        if (modCheck(channel.members.get(id), serverConfig)) {
                            modList.push(channel.members.get(id).user.tag);
                        } else if (channel.members.has(id)) {
                            channel.members.get(id).voice.disconnect();
                            userList.push(channel.members.get(id).user.tag);
                        }
                    }
                    if (modList.length < 1) {
                        embMsg.setTitle(`Kicked users`).setDescription(`${userList} were kicked successfully.`);
                    } else {
                        embMsg.setTitle(`Kicked user`).setDescription(`${userList} were kicked successfully.\n${modList} were unable to be kicked because they are a mod or higher in the server.`);
                    }
                    interaction.editReply({ embeds: [embMsg], components: [] });
                    VCSelect.edit({ components: [] });
                    VCKickInteraction.deferReply();
                    VCKickInteraction.deleteReply();
                });
                break;
            }

            //#endregion

            //#region on button press - Ban
            case ButtonAction.VCBan: {
                const stringSelect: SelectMenuComponentOptionData[] = [];
                let numberOfOptions = 0;
                for (const [id, member] of channel.members) {
                    stringSelect.push({ label: member.user.tag, value: id });
                    if (numberOfOptions < 10) {
                        numberOfOptions++;
                    }
                }
                const embMsgBan = new EmbedBuilder().setTitle('Ban users').setDescription('Select up to 10 users to Ban them from the voice chat.').setColor('#00A0FF');
                const VCBanUserMenu = new StringSelectMenuBuilder().setCustomId(SelectAction.VCBanUser).setMinValues(1).setMaxValues(numberOfOptions).addOptions(stringSelect);
                await interaction.deferReply({ ephemeral: true });
                const VCSelect = await interaction.followUp({ embeds: [embMsgBan], components: [new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(VCBanUserMenu)] });

                await VCSelect.awaitMessageComponent<ComponentType.StringSelect>().then(async (VCBanInteraction) => {
                    const modList: string[] = [];
                    const userList: string[] = [];
                    for (const id of VCBanInteraction.values) {
                        if (modCheck(channel.members.get(id), serverConfig)) {
                            modList.push(channel.members.get(id).user.tag);
                        } else if (channel.members.has(id)) {
                            channel.permissionOverwrites.edit(id, { Connect: false });
                            channel.members.get(id).voice.disconnect();
                            userList.push(channel.members.get(id).user.tag);
                        }
                    }
                    if (modList.length < 1) {
                        embMsg.setTitle(`Banned users`).setDescription(`${userList} were banned successfully.`);
                    } else {
                        embMsg.setTitle(`Banned user`).setDescription(`${userList} were banned successfully.\n${modList} were unable to be banned because they are a mod or higher in the server.`);
                    }
                    interaction.editReply({ embeds: [embMsg], components: [] });
                    VCSelect.edit({ components: [] });
                    VCBanInteraction.deferReply();
                    VCBanInteraction.deleteReply();
                });
                break;
            }
            //#endregion

            //#region on button press - Change Owner
            case ButtonAction.VCNewOwner: {
                const stringSelect: SelectMenuComponentOptionData[] = [];
                for (const [id, member] of channel.members) {
                    stringSelect.push({ label: member.user.tag, value: id });
                }

                const embMsgOwner = new EmbedBuilder().setTitle('Change Owner').setDescription('Select a user to transfer ownership of this channel to.').setColor('#00A0FF');
                const VCOwnerMenu = new StringSelectMenuBuilder().setCustomId(SelectAction.VCNewOwnerAction).setMinValues(1).setMaxValues(1).addOptions(stringSelect);
                await interaction.deferReply({ ephemeral: true });
                const VCSelect = await interaction.followUp({ embeds: [embMsgOwner], components: [new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(VCOwnerMenu)], ephemeral: true });

                await VCSelect.awaitMessageComponent<ComponentType.StringSelect>().then(async (VCNewOwnerInteraction) => {
                    if (channel.members.has(VCNewOwnerInteraction.values[0])) {
                        collections.voiceGenerator.set(channel.id, VCNewOwnerInteraction.values[0]);
                        embMsg.setTitle(`New Owner`).setDescription(`${channel.members.get(VCNewOwnerInteraction.values[0])} is now the new owner.`);
                    } else {
                        embMsg.setTitle(`New Owner`).setDescription(`Cannot change owner to someone not in the channel.`);
                    }
                    interaction.editReply({ embeds: [embMsg], components: [] });
                    VCNewOwnerInteraction.deferReply();
                    VCNewOwnerInteraction.deleteReply();
                });
                break;
            }
            //#endregion

            //#region on button press - Claim Channel
            case ButtonAction.VCClaim:
                if (channel.members.has(collections.voiceGenerator.get(channel.id))) {
                    embMsg.setTitle('Already Claimed').setDescription('The owner is still in this channel.');
                } else if (channel.members.has(interaction.user.id)) {
                    collections.voiceGenerator.set(channel.id, interaction.user.id);
                    embMsg.setTitle('Claimed').setDescription('You are now the owner of this channel.');
                } else {
                    embMsg.setTitle('Error').setDescription('Cannot change owner to someone not in the channel.');
                }
                interaction.reply({ embeds: [embMsg], ephemeral: true });
                break;
            //#endregion
        }
    });
}
//#endregion panel

//#region exports
export { joinToCreateHandling };
//#endregion
