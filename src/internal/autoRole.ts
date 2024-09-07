//#region Imports
import { Client, Events } from 'discord.js';
import { MongooseServerConfig, ServerConfig } from '../models/serverConfigModel.js';
import { MongooseAutoRoleList } from '../models/autoRoleList.js';
import { addToLog } from '../helpers/errorLog.js';
import { LogType } from '../models/loggingModel.js';
//#endregion

//#region Function that generates embed fields
/**
 * Generates the embed fields and ties the emoji to their respective role from serverConfig.
 * @param serverID - Server ID for the server the command is run in
 * @returns A map of the emoji-role pairs
 */
async function generateEmbedFields(serverConfig: ServerConfig) {
    return serverConfig.autoRole.roles.map((r, e) => {
        return {
            emoji: serverConfig.autoRole.reactions[e],
            role: r,
        };
    });
}
//#endregion

//#region Function that starts the listening to see if a user hits a reaction, and gives them the role when they do react
/**
 * This function starts the listening to see if a user hits a reaction, and gives them the role when they do react.
 * @param client - Discord.js Client Object
 */
async function autoRoleListener(client: Client) {
    //#region Loads Messages to Listen to
    const authRoleLists = await MongooseAutoRoleList.find({}).exec();
    //Does not work
    // const roleChannels: RoleChannel[] = [];
    //Specifically right here, this is always = [] for some reason, making it work for now fix later
    // authRoleLists.forEach((authRoleList) => roleChannels.concat(authRoleList.roleChannels));

    // console.log(roleChannels);

    // const chans: { chan: Channel; messageIDs: string[] }[] = [];
    // for (const chan of roleChannels) {
    //     const channel = await client.channels.fetch(chan.id);
    //     console.log(channel);
    //     chans.push({ chan: channel, messageIDs: chan.messageIDs });
    // }

    // for (const chan of chans) {
    //     if (!chan.chan || chan.chan.isDMBased() || !chan.chan.isTextBased()) {
    //         return;
    //     }
    //     for (const msg of chan.messageIDs) {
    //         await chan.chan.messages.fetch(msg).then((m) => console.log(m));
    //     }
    // }

    //Yes I know its bad but it works we will fix it later
    for (const autRoleList of authRoleLists) {
        for (const channels of autRoleList.roleChannels) {
            const channel = await client.channels.fetch(channels.id);
            if (!channel || channel.isDMBased() || !channel.isTextBased()) {
                return;
            }
            for (const msg of channels.messageIDs) {
                await channel.messages.fetch(msg);
            }
        }
    }

    //#endregion
    console.log('AutoRoleListener Started');

    //#region This event handel adding a role to a user when the react to the add role message
    client.on(Events.MessageReactionAdd, async (reaction, user) => {
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
            //Error, Reaction not Valid
            addToLog(LogType.Alert, `${reaction.emoji.name}:${reaction.emoji.id} - is not found`, member.user.tag, message.guild.name, message.channel.name, 'Issue with ReactEmoji Event', client);
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

    //#region This handles when people remove a reaction in order to remove a role
    client.on(Events.MessageReactionRemove, async (reaction, user) => {
        const message = reaction.message;

        //This escapes if the reaction was in a vc or a dm, or done by a bot
        if (!message.channel.isTextBased() || message.channel.isDMBased() || user.bot) {
            return;
        }

        const serverID = message.channel.guild.id;
        const member = message.guild.members.cache.get(user.id);

        //Gets serverConfig from database
        const serverConfig = (await MongooseServerConfig.findById(serverID).exec()).toObject();

        const emojiKey = reaction.emoji.id ? reaction.emoji.id : reaction.emoji.name; //`${reaction.emoji.name}:${reaction.emoji.id}`
        const react = message.reactions.cache.get(emojiKey);

        if (!react) {
            //Error, Reaction not Valid
            addToLog(LogType.Alert, `${emojiKey} - is not found`, member.user.tag, message.guild.name, message.channel.name, 'Issue with ReactEmoji Event', client);
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
                            member.roles.remove(guildRole.id);
                        }
                    }
                }
            }
        }
    });
    //#endregion

    //#region Listens for a autoRole message to be deleted
    client.on(Events.MessageDelete, async (event) => {
        //This escapes if the deleted message was in a vc or dm, or not authored by this bot
        // if (event.channel.isDMBased() || !event.author || event.author == undefined || event.author.id != process.env.clientID) {
        //     return;
        // }

        //Pulls message listening info from db
        const botConfig = await MongooseAutoRoleList.findById(event.guildId).exec();
        let needsUpdate: boolean = false;

        //Deletes listening info for message once its deleted
        for (const i in botConfig.roleChannels) {
            if (botConfig.roleChannels[i].id == event.channelId) {
                const msgID = botConfig.roleChannels[i].messageIDs.indexOf(event.id);
                if (msgID > -1) {
                    botConfig.roleChannels[i].messageIDs.splice(msgID, 1);
                    if (botConfig.roleChannels[i].messageIDs.length < 1) {
                        botConfig.roleChannels.splice(Number(i), 1);
                        botConfig.markModified('channelIDs');
                        needsUpdate = true;
                    } else {
                        botConfig.markModified('channelIDs');
                        needsUpdate = true;
                    }
                }
            }
        }

        if (needsUpdate) {
            await botConfig.save().then(() => {
                console.log(`Updated AutoRoleListeningDB for ${event.guildId}`);
            });
        }
    });
    //#endregion
}
//#endregion

//#region exports
export { autoRoleListener, generateEmbedFields };
//#endregion
