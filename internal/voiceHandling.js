//#region Dependencies
const { Collection, VoiceState, ChannelType, PermissionFlagsBits } = require('discord.js');
const { readFileSync } = require('fs');
//#endregion

//#region Data Files
var serverConfig = JSON.parse(readFileSync('./data/serverConfig.json', 'utf8'));
//#endregion

//#region Helpers
const { addToLog } = require('../helpers/errorLog.js');
//#endregion

//#region Function that starts the listener that handles Join to Create Channels
/**
 * This function starts the listener that handles that handles Join to Create Channels.
 * @param {Client} client - Discord.js Client Object
 */
async function joinToCreateHandling(client) {
    client.voiceGenerator = new Collection();

    //This handles the event of a user joining or disconnecting from a voice channel
    client.on("voiceStateUpdate", async (oldState, newState) => {
        const { member, guild } = newState;
        const serverID = guild.id;
        const oldChannel = oldState.channel;
        const newChannel = newState.channel;

        if (serverConfig[serverID].setupNeeded) {
            return;
        }

        if ( serverConfig[serverID].JTCVC.enable && oldChannel !== newChannel && newChannel && newChannel.id === serverConfig[serverID].JTCVC.voiceChannel) {
            //Creates new voice channel
            const voiceChannel = await guild.channels.create({
                name: `${member.user.tag}'s Channel`,
                type: ChannelType.GuildVoice,
                parent: newChannel.parent,
                permissionOverwrites: newChannel.parent.permissionOverwrites.cache.map((p) => {
                    return {
                        id: p.id,
                        allow: p.allow.toArray(),
                        deny: p.deny.toArray()
                    }
                })
            });

            //Adds the voice channel just made to the collection
            client.voiceGenerator.set(voiceChannel.id, member.id);
            client.voiceGenerator.set(member.id, voiceChannel.id);
            
            //Times the user out from spamming new voice channels, currently set to 10 seconds
            await newChannel.permissionOverwrites.edit(member, {deny: PermissionFlagsBits.Connect});
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
            } else if (client.voiceGenerator.get(oldChannel.id) && member.id == client.voiceGenerator.get(oldChannel.id)) {
                //This should restore default permissions to the channel when the owner leaves, and remove owner
                await oldChannel.permissionOverwrites.edit(oldChannel.parent.permissionOverwrites.cache.map((p) => {
                    return {
                        id: p.id,
                        allow: p.allow.toArray(),
                        deny: p.deny.toArray()
                    }
                }));
                client.voiceGenerator.delete(client.voiceGenerator.get(oldChannel.id));
            }
        } catch (err) {
            addToLog('Fatal Error', "JTCVC Handler", member.id, guild.name, oldChannel.name, err, client);
        }

    });
}
//#endregion

//#region exports
module.exports = { joinToCreateHandling };
//#endregion