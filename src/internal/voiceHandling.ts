//#region Imports
import { Collection, ChannelType, PermissionFlagsBits, Client, Events } from 'discord.js';
import { addToLog } from '../helpers/errorLog.js';
import { MongooseServerConfig } from '../models/serverConfigModel.js';
import { ExtraCollections } from '../models/extraCollectionsModel.js';
import { LogType } from '../models/loggingModel.js';
//#endregion

//#region Function that starts the listener that handles Join to Create Channels
/**
 * This function starts the listener that handles that handles Join to Create Channels.
 * @param client - Discord.js Client Object
 * @param collections - Class containing all the extra collections for the bot
 */
async function joinToCreateHandling(client: Client, collections: ExtraCollections) {
    collections.voiceGenerator = new Collection();

    //This handles the event of a user joining or disconnecting from a voice channel
    client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
        const { member, guild } = newState;
        const serverID = guild.id;
        const oldChannel = oldState.channel;
        const newChannel = newState.channel;

        if (oldChannel == newChannel) {
            return;
        }

        //#region Handles someone leaving a voice channel
        try {
            if (oldChannel == null) {
                return;
            }
            if (collections.voiceGenerator.get(oldChannel.id) && oldChannel.members.size == 0) {
                //This deletes a channel if it was created byt the bot and is empty
                oldChannel.delete();
                collections.voiceGenerator.delete(collections.voiceGenerator.get(oldChannel.id));
                collections.voiceGenerator.delete(oldChannel.id);
            } else if (collections.voiceGenerator.get(oldChannel.id) && member.id == collections.voiceGenerator.get(oldChannel.id)) {
                //This should restore default permissions to the channel when the owner leaves, and remove owner
                await oldChannel.permissionOverwrites.set(
                    oldChannel.parent.permissionOverwrites.cache.map((p) => {
                        return {
                            id: p.id,
                            allow: p.allow.toArray(),
                            deny: p.deny.toArray(),
                        };
                    })
                );
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

            //Adds the voice channel just made to the collection
            collections.voiceGenerator.set(voiceChannel.id, member.id);

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
}
//#endregion

//#region exports
export { joinToCreateHandling };
//#endregion
