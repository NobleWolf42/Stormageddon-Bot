//#region Imports
import { ButtonInteraction, Client, ComponentType, Message, ChannelType, ButtonStyle, ButtonBuilder, ActionRowBuilder, PermissionsBitField } from 'discord.js';
import { MongooseTicketList, TicketChannel } from '../models/ticketingList.js';
import { MongooseServerConfig } from '../models/serverConfigModel.js';
//#endregion

//#region Function that starts the listening to see if a user hits a reaction, and gives them the role when they do react
/**
 * This function starts the listening to see if a user hits a reaction, and gives them the role when they do react.
 * @param client - Discord.js Client Object
 */
async function ticketListener(client: Client) {
    //#region Loads Messages to Listen to
    const ticketLists = await MongooseTicketList.find({}).exec();
    const channelObjects: TicketChannel[] = [];

    for (const guild of ticketLists) {
        for (const channels of guild.ticketChannels) {
            channelObjects.push(channels);
        }
    }

    for (const channels of channelObjects) {
        const channel = await client.channels.fetch(channels.id);
        if (!channel || channel.isDMBased() || !channel.isTextBased()) {
            return;
        }
        for (const msg of channels.messageIDs) {
            const ticketMsg = await channel.messages.fetch(msg);
            ticketCollector(ticketMsg);
        }
    }

    //#endregion

    console.log('... OK');
}
//#endregion

//#region Listens for message button clicks
/**
 * This function takes a message and listens to the buttons on it
 * @pram message - Discord.js Message Object
 */
async function ticketCollector(message: Message) {
    const collector = message.createMessageComponentCollector({
        componentType: ComponentType.Button,
    });

    collector.on('collect', async (interaction: ButtonInteraction) => {
        switch (interaction.customId) {
            case 'newTicket': {
                //creates a new text channel
                const botConfig = await MongooseTicketList.findById(interaction.guildId).exec();
                const serverConfig = await MongooseServerConfig.findById(interaction.guildId).exec();
                botConfig.ticketNumber = botConfig.ticketNumber + 1;
                botConfig.markModified('ticketNumber');
                await botConfig.save().then(() => {
                    console.log(`Updated TicketingListeningDB for ${interaction.guildId}`);
                });

                const ticketChannel = await interaction.guild.channels.create({
                    name: `${interaction.member.user.username}'s Ticket - #${botConfig.ticketNumber}`,
                    type: ChannelType.GuildText,
                    parent: interaction.channel.parent,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: serverConfig.general.modRoles,
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        },
                    ],
                });

                panelCreation(ticketChannel, collections, serverConfig);

                break;
            }

            case 'closeTicket': {
                //creates a new text channel
                const botConfig = await MongooseTicketList.findById(interaction.guildId).exec();
                botConfig.ticketNumber = botConfig.ticketNumber + 1;
                botConfig.markModified('ticketNumber');
                await botConfig.save().then(() => {
                    console.log(`Updated TicketingListeningDB for ${interaction.guildId}`);
                });

                const ticketChannel = await guild.channels.create({
                    name: `${interaction.member.user.username}'s Ticket - #${botConfig.ticketNumber}`,
                    type: ChannelType.GuildText,
                    parent: interaction.channel.parent,
                    permissionOverwrites: newChannel.parent.permissionOverwrites.cache.map((p) => {
                        return {
                            id: p.id,
                            allow: p.allow.toArray(),
                            deny: p.deny.toArray(),
                        };
                    }),
                });

                panelCreation(ticketChannel, collections, serverConfig);

                break;
            }
        }
    });
    //#endregion
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
    const closeTicketButton = new ButtonBuilder().setCustomId('closeTicket').setLabel('Close Ticket 📫').setStyle(ButtonStyle.Secondary);
    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(closeTicketButton);
    //#endregion

    const panelMessage = await channel.send({
        embeds: [embMsg],
        components: [buttons],
    });

    ticketCollector(panelMessage);
}
//#endregion

//#region exports
export { ticketListener, ticketCollector };
//#endregion
