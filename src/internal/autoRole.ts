//#region Dependencies
import { Client, DMChannel, Message, MessageReaction, PartialGroupDMChannel } from 'discord.js';
//#endregion

//#region Modules
import { MongooseServerConfig } from '../models/serverConfig.js';
//#endregion

//#region Function that generates embed fields
/**
 * Generates the embed fields and ties the emoji to their respective role from serverConfig.
 * @param {string} serverID - Server ID for the server the command is run in
 * @returns {map} A map of the emoji-role pairs
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
 * @param {Client} client - Discord.js Client Object
 */
async function autoRoleListener(client: Client) {
    //#region Readable constants
    // This makes the events used a bit more readable
    const events = {
        MESSAGE_REACTION_ADD: 'messageReactionAdd',
        MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
    };
    //#endregion
    console.log('autoRoleListener');

    //#region This event handel adding a role to a user when the react to the add role message
    client.on('messageReactionAdd', async (event) => {
        console.log('addReact');
        const message = event.message;

        //This escapes if the reaction was in a vc or a dm
        if (!message.channel.isTextBased() || message.channel.isDMBased()) {
            return;
        }

        const serverID = message.channel.guild.id;
        //const member = message.guild.members.cache.get();

        //Gets serverConfig from database
        let serverConfig = (await MongooseServerConfig.findById(serverID).exec()).toObject();

        // if (
        //     message.author.id === client.user.id &&
        //     (message.content !== serverConfig.autoRole.embedMessage || (message.embeds[0] && message.embeds[0].footer.text !== serverConfig.autoRole.embedFooter))
        // ) {
        //     if (message.embeds.length >= 1) {
        //         const fields = message.embeds[0].fields;

        //         for (const { name, value } of fields) {
        //             if (member.id !== client.user.id) {
        //                 const guildRole = message.guild.roles.cache.find((r) => r.name === value);
        //                 if (name === reaction.emoji.name || name === reaction.emoji.toString()) {
        //                     if (event.t === 'MESSAGE_REACTION_ADD') member.roles.add(guildRole.id);
        //                     else if (event.t === 'MESSAGE_REACTION_REMOVE') member.roles.remove(guildRole.id);
        //                 }
        //             }
        //         }
        //     }
        // }
    });
    //#endregion

    //#region This handles when people remove a reaction in order to remove a role
    client.on('messageReactionRemove', async (event) => {
        console.log('removeReact');
    });
    //#endregion

    //#region This event handles adding/removing users from the role(s) they chose based on message reactions
    // client.on('raw', async (event) => {
    //     console.log(event);
    //     if (!events.hasOwnProperty(event.t)) {
    //         return;
    //     }

    //     const { d: data } = event;
    //     const user = client.users.cache.get(data.user_id);
    //     const channel = client.channels.cache.get(data.channel_id);

    //     //I hate typescript but this filers out the channels we don't want to watch
    //     if (!channel.isTextBased() || channel.isDMBased()) {
    //         return;
    //     }

    //     const message = await channel.messages.fetch(data.message_id);
    //     const member = message.guild.members.cache.get(user.id);
    //     let serverID = message.channel.guild.id;

    //     //Gets serverConfig from database
    //     var serverConfig = (await MongooseServerConfig.findById(serverID).exec()).toObject();

    //     const emojiKey = data.emoji.id ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
    //     let reaction = message.reactions.cache.get(emojiKey);

    //     if (!reaction) {
    //         // Create an object that can be passed through the event like normal
    //         reaction = new MessageReaction(client, data, message, 1, data.user_id === client.user.id);
    //     }

    //     let embedFooterText;
    //     if (message.embeds[0] && message.embeds[0].footer != null) embedFooterText = message.embeds[0].footer.text;

    //     if (message.author.id === client.user.id && (message.content !== serverConfig.autoRole.initialMessage || (message.embeds[0] && embedFooterText !== serverConfig.autoRole.embedFooter))) {
    //         if (message.embeds.length >= 1) {
    //             const fields = message.embeds[0].fields;

    //             for (const { name, value } of fields) {
    //                 if (member.id !== client.user.id) {
    //                     const guildRole = message.guild.roles.cache.find((r) => r.name === value);
    //                     if (name === reaction.emoji.name || name === reaction.emoji.toString()) {
    //                         if (event.t === 'MESSAGE_REACTION_ADD') member.roles.add(guildRole.id);
    //                         else if (event.t === 'MESSAGE_REACTION_REMOVE') member.roles.remove(guildRole.id);
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // });
    // //#endregion

    // //#region This handles unhandled rejections
    // process.on('unhandledRejection', (err) => {
    //     const msg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
    //     console.error('Unhandled Rejection', msg);
    // });
    //#endregion
}
//#endregion

//#region exports
export { autoRoleListener, generateEmbedFields };
//#endregion
