var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//#region Dependencies
import { Collection, ChannelType, PermissionFlagsBits } from 'discord.js';
//#endregion
//#region Helpers
import { addToLog } from '../helpers/errorLog.js';
//#endregion
//#region Function that starts the listener that handles Join to Create Channels
/**
 * This function starts the listener that handles that handles Join to Create Channels.
 * @param {Client} client - Discord.js Client Object
 */
function joinToCreateHandling(client) {
    return __awaiter(this, void 0, void 0, function* () {
        client.voiceGenerator = new Collection();
        //This handles the event of a user joining or disconnecting from a voice channel
        client.on('voiceStateUpdate', (oldState, newState) => __awaiter(this, void 0, void 0, function* () {
            const { member, guild } = newState;
            const serverID = guild.id;
            const oldChannel = oldState.channel;
            const newChannel = newState.channel;
            //Calls serverConfig from database
            var serverConfig = (yield MongooseServerConfig.findById(message.guild.id).exec()).toObject();
            if (serverConfig.setupNeeded) {
                return;
            }
            if (serverConfig.JTCVC.enable && oldChannel !== newChannel && newChannel && newChannel.id === serverConfig.JTCVC.voiceChannel) {
                //Creates new voice channel
                const voiceChannel = yield guild.channels.create({
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
                client.voiceGenerator.set(voiceChannel.id, member.id);
                client.voiceGenerator.set(member.id, voiceChannel.id);
                //Times the user out from spamming new voice channels, currently set to 10 seconds and apparently works intermittently, probably dur to the permissions when testing it
                yield newChannel.permissionOverwrites.edit(member, {
                    deny: PermissionFlagsBits.Connect,
                });
                setTimeout(() => newChannel.permissionOverwrites.delete(member), 10 * 1000);
                return member.voice.setChannel(voiceChannel);
            }
            //Handles someone leaving a voice channel
            try {
                if (oldChannel == null) {
                    return;
                }
                if (oldChannel != null && client.voiceGenerator.get(oldChannel.id) && oldChannel.members.size == 0) {
                    //This deletes a channel if it was created byt the bot and is empty
                    oldChannel.delete();
                    client.voiceGenerator.delete(client.voiceGenerator.get(oldChannel.id));
                    client.voiceGenerator.delete(oldChannel.id);
                }
                else if (client.voiceGenerator.get(oldChannel.id) && member.id == client.voiceGenerator.get(oldChannel.id)) {
                    //This should restore default permissions to the channel when the owner leaves, and remove owner THIS IS BROKEN AND SERVERS NO PURPOSE RIGHT NOW
                    /*await oldChannel.permissionOverwrites.edit(oldChannel.parent.permissionOverwrites.cache.map((p) => {
                        return {
                            id: p.id,
                            allow: p.allow.toArray(),
                            deny: p.deny.toArray()
                        }
                    }));*/
                    client.voiceGenerator.delete(client.voiceGenerator.get(oldChannel.id));
                }
            }
            catch (err) {
                addToLog('Fatal Error', 'JTCVC Handler', member.tag, guild.name, oldChannel.name, err, client);
            }
        }));
    });
}
//#endregion
//#region exports
export { joinToCreateHandling };
//#endregion
