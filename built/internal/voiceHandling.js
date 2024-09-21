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
import { ChannelType, Events, PermissionFlagsBits } from 'discord.js';
import { addToLog } from '../helpers/errorLog.js';
import { MongooseJTCVCList } from '../models/jtcvcList.js';
import { LogType } from '../models/loggingModel.js';
import { MongooseServerConfig } from '../models/serverConfigModel.js';
//#endregion
//#region Function that starts the listener that handles Join to Create Channels
/**
 * This function starts the listener that handles that handles Join to Create Channels.
 * @param client - Discord.js Client Object
 * @param collections - Class containing all the extra collections for the bot
 */
function joinToCreateHandling(client, collections) {
    return __awaiter(this, void 0, void 0, function* () {
        const jtcvcLists = yield MongooseJTCVCList.find({}).exec();
        for (const channel of jtcvcLists) {
            const channelObj = yield client.channels.fetch(channel.id).catch((err) => {
                console.log(err.message);
            });
            if (!channelObj || !channelObj.isVoiceBased() || channelObj.members.size < 1) {
                if (channelObj && channelObj.isVoiceBased() && channelObj.members.size < 1) {
                    channelObj.delete();
                }
                channel.deleteOne().exec();
            }
            else {
                collections.voiceGenerator.set(channel.id, channel.memberID);
            }
        }
        //This handles the event of a user joining or disconnecting from a voice channel
        client.on(Events.VoiceStateUpdate, (oldState, newState) => __awaiter(this, void 0, void 0, function* () {
            const { member, guild } = newState;
            const serverID = guild.id;
            const oldChannel = oldState.channel;
            const newChannel = newState.channel;
            // eslint-disable-next-line
            let channelList = null;
            if (oldChannel == newChannel) {
                return;
            }
            //#region Handles someone leaving a voice channel
            try {
                if (oldChannel != null) {
                    if (collections.voiceGenerator.get(oldChannel.id) && oldChannel.members.size == 0) {
                        //This deletes a channel if it was created byt the bot and is empty
                        channelList = yield MongooseJTCVCList.findById(oldChannel.id).exec();
                        oldChannel.delete();
                        channelList.deleteOne().exec();
                        collections.voiceGenerator.delete(oldChannel.id);
                    }
                    else if (collections.voiceGenerator.get(oldChannel.id) && member.id == collections.voiceGenerator.get(oldChannel.id)) {
                        //This should restore default permissions to the channel when the owner leaves, and remove owner
                        yield oldChannel.permissionOverwrites.set(oldChannel.parent.permissionOverwrites.cache.map((p) => {
                            return {
                                id: p.id,
                                allow: p.allow.toArray(),
                                deny: p.deny.toArray(),
                            };
                        }));
                    }
                }
            }
            catch (err) {
                addToLog(LogType.FatalError, 'JTCVC Handler', member.user.tag, guild.name, oldChannel.name, err, client);
            }
            //#endregion
            //Calls serverConfig from database
            const serverConfig = (yield MongooseServerConfig.findById(serverID).exec()).toObject();
            if (serverConfig.setupNeeded) {
                return;
            }
            //#region Handles someone joining the JTC VC
            if (serverConfig.JTCVC.enable && newChannel && newChannel.id === serverConfig.JTCVC.voiceChannel) {
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
                collections.voiceGenerator.set(voiceChannel.id, member.id);
                channelList = yield MongooseJTCVCList.findById(voiceChannel.id).exec();
                if (channelList == null) {
                    channelList = new MongooseJTCVCList();
                    channelList._id = voiceChannel.id;
                    channelList.memberID = member.id;
                    channelList.markModified('_id');
                    channelList.markModified('memberID');
                }
                channelList.save();
                //Times the user out from spamming new voice channels, currently set to 10 seconds and apparently works intermittently, probably due to the permissions when testing it
                yield newChannel.permissionOverwrites.set([
                    {
                        id: member.id,
                        deny: [PermissionFlagsBits.Connect],
                    },
                ]);
                setTimeout(() => newChannel.permissionOverwrites.delete(member), 10 * 1000);
                return member.voice.setChannel(voiceChannel);
            }
            //#endregion
        }));
        console.log('... OK');
    });
}
//#endregion
//#region exports
export { joinToCreateHandling };
//#endregion
