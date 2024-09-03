//#region Imports
import { Client, Events } from 'discord.js';
import { MongooseServerConfig } from '../models/serverConfigModel.js';
import { AutoRoleList, MongooseAutoRoleList } from '../models/autoRoleList.js';
import { addToLog } from '../helpers/errorLog.js';
import { LogType } from '../models/loggingModel.js';
//#endregion

//#region Function that generates embed fields
/**
 * Generates the embed fields and ties the emoji to their respective role from serverConfig.
 * @param serverID - Server ID for the server the command is run in
 * @returns A map of the emoji-role pairs
 */
async function generateEmbedFields(serverID: string) {
    //Gets serverConfig from database
    var serverConfig = (await MongooseServerConfig.findById(serverID).exec()).toObject();

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
    let botConfig = await MongooseAutoRoleList.find({}).exec();
    for (let i in botConfig) {
        for (let j of botConfig[i].channelIDs) {
            console.log(j);
            const channel = await client.channels.fetch(j[0]);
            if (channel && !channel.isDMBased() && channel.isTextBased()) {
                for (let k in j) {
                    if (j[k] != j[0]) {
                        console.log(j[k]);
                        await channel.messages.fetch(j[k]);
                    }
                }
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
        let serverConfig = (await MongooseServerConfig.findById(serverID).exec()).toObject();

        const emojiKey = reaction.emoji.id ? reaction.emoji.id : reaction.emoji.name; //`${reaction.emoji.name}:${reaction.emoji.id}`
        let react = message.reactions.cache.get(emojiKey);

        if (!react) {
            //Error, Reaction not Valid
            addToLog(
                LogType.Alert,
                `${reaction.emoji.name}:${reaction.emoji.id} - is not found`,
                member.user.username,
                message.guild.name,
                message.channel.name,
                'Issue with ReactEmoji Event',
                client
            );
        }

        let embedFooterText: string;
        if (message.embeds[0] && message.embeds[0].footer != null) {
            embedFooterText = message.embeds[0].footer.text;
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
        let serverConfig = (await MongooseServerConfig.findById(serverID).exec()).toObject();

        const emojiKey = reaction.emoji.id ? reaction.emoji.id : reaction.emoji.name; //`${reaction.emoji.name}:${reaction.emoji.id}`
        let react = message.reactions.cache.get(emojiKey);

        if (!react) {
            //Error, Reaction not Valid
            addToLog(LogType.Alert, `${emojiKey} - is not found`, member.user.username, message.guild.name, message.channel.name, 'Issue with ReactEmoji Event', client);
        }

        let embedFooterText: string;
        if (message.embeds[0] && message.embeds[0].footer != null) {
            embedFooterText = message.embeds[0].footer.text;
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
        let botConfig = await MongooseAutoRoleList.findById(event.guildId).exec();
        let needsUpdate: boolean = false;

        //Deletes listening info for message once its deleted
        for (let i of botConfig.channelIDs) {
            if (i[0] == event.channelId) {
                let j = i.indexOf(event.id);
                if (j > -1) {
                    i.splice(j, 1);
                    if (i.length < 2) {
                        botConfig.channelIDs.splice(botConfig.channelIDs.indexOf(i), 1);
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
