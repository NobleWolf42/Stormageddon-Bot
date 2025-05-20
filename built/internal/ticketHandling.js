/*
//#region Imports
import { ButtonInteraction, Client, ComponentType, Events } from 'discord.js';
import { addToLog } from '../helpers/errorLog.js';
import { MongooseTicketList, TicketChannel } from '../models/ticketingList.js';
import { LogType } from '../models/loggingModel.js';
import { MongooseServerConfig } from '../models/serverConfigModel.js';
//#endregion

//#region Function that starts the listening to see if a user hits a reaction, and gives them the role when they do react
/**
 * This function starts the listening to see if a user hits a reaction, and gives them the role when they do react.
 * @param client - Discord.js Client Object
 */
export {};
/*
async function ticketListener(client: Client) {
    //#region Loads Messages to Listen to
    const ticketLists = await MongooseTicketList.find({}).exec();
    const channelObjects: TicketChannel[] = [];

    for (const guild of ticketLists) {
        for (const channels of guild.roleChannels) {
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
            const collector = ticketMsg.createMessageComponentCollector({
                componentType: ComponentType.Button,
            });

            //#region This event handel adding a role to a user when the react to the add role message
            collector.on('collect', async (interaction: ButtonInteraction) => {
                const message = reaction.message;

                //This escapes if the reaction was in a vc or dm, or done by a bot
                if (!message.channel.isTextBased() || message.channel.isDMBased() || user.bot) {
                    return;
                }

                const serverID = message.channel.guild.id;
                const member = message.guild.members.cache.get(user.id);

                //Gets serverConfig from database
                const serverConfig = (await MongooseServerConfig.findById(serverID).exec()).toObject();

                //Stops if the feature is not enabled
                if (!serverConfig.autoRole.enable) {
                    return;
                }

                const emojiKey = reaction.emoji.id ? reaction.emoji.id : reaction.emoji.name; //`${reaction.emoji.name}:${reaction.emoji.id}`
                const react = message.reactions.cache.get(emojiKey);

                if (!react) {
                    //Error, Reaction not Valid FIXME triggers randomly on normal messages
                    addToLog(
                        LogType.Alert,
                        `${reaction.emoji.name}:${reaction.emoji.id} - is not found`,
                        member.user.tag,
                        message.guild.name,
                        message.channel.name,
                        'Issue with ReactEmoji Event',
                        client
                    );
                }

                if (
                    message.author.id === client.user.id &&
                    (message.content !== serverConfig.autoRole.embedMessage || (message.embeds[0] && message.embeds[0].footer.text !== serverConfig.autoRole.embedFooter))
                ) {
                    if (message.embeds.length >= 1) {
                        const fields = message.embeds[0].fields;

                        for (const { name, value } of fields) {
                            if (member.id !== client.user.id) {
                                const guildRole = message.guild.roles.cache.find((r) => r.name === value);
                                if (name === react.emoji.name || name === react.emoji.toString()) {
                                    member.roles.add(guildRole.id);
                                }
                            }
                        }
                    }
                }
            });
            //#endregion
        }
    }

    //#endregion

    console.log('... OK');
}
//#endregion

//#region exports
export { ticketListener as autoRoleListener };
//#endregion
*/
