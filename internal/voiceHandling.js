//#region Dependencies
const {
  Collection,
  VoiceState,
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const { readFileSync } = require("fs");
//#endregion

//#region Data Files
var serverConfig = JSON.parse(readFileSync("./data/serverConfig.json", "utf8"));
//#endregion

//#region Helpers
const { addToLog } = require("../helpers/errorLog.js");
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

    if (
      serverConfig[serverID].JTCVC.enable &&
      oldChannel !== newChannel &&
      newChannel &&
      newChannel.id === serverConfig[serverID].JTCVC.voiceChannel
    ) {
      //Creates new voice channel
      const voiceChannel = await guild.channels.create({
        name: `${member.user.tag}'s Channel`,
        type: ChannelType.GuildVoice,
        parent: newChannel.parent,
        permissionOverwrites: newChannel.parent.permissionOverwrites.cache.map(
          (p) => {
            return {
              id: p.id,
              allow: p.allow.toArray(),
              deny: p.deny.toArray(),
            };
          }
        ),
      });

      //Adds the voice channel just made to the collection
      client.voiceGenerator.set(voiceChannel.id, member.id);
      client.voiceGenerator.set(member.id, voiceChannel.id);

      //Times the user out from spamming new voice channels, currently set to 10 seconds and apparently works intermittently, probably dur to the permissions when testing it
      await newChannel.permissionOverwrites.edit(member, {
        deny: PermissionFlagsBits.Connect,
      });
      setTimeout(
        () => newChannel.permissionOverwrites.delete(member),
        10 * 1000
      );

      return member.voice.setChannel(voiceChannel);
    }

    //Handles someone leaving a voice channel
    try {
      if (oldChannel == null) {
        return;
      }
      if (
        oldChannel != null &&
        client.voiceGenerator.get(oldChannel.id) &&
        oldChannel.members.size == 0
      ) {
        //This deletes a channel if it was created byt the bot and is empty
        oldChannel.delete();
        client.voiceGenerator.delete(client.voiceGenerator.get(oldChannel.id));
        client.voiceGenerator.delete(oldChannel.id);
      } else if (
        client.voiceGenerator.get(oldChannel.id) &&
        member.id == client.voiceGenerator.get(oldChannel.id)
      ) {
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
    } catch (err) {
      addToLog(
        "Fatal Error",
        "JTCVC Handler",
        member.tag,
        guild.name,
        oldChannel.name,
        err,
        client
      );
    }
  });
}
//#endregion

//#region
/**
 *
 * @param {*} client
 */
async function logOnVoiceStateUpdate(client) {

  // setup a listener for voice state update
  client.on("voiceStateUpdate", async (oldState, newState) => {
    // extract the member? and the channel
    const newChannel = newState.channel;
    const oldChannel = oldState.channel;
    var member = null;
    var guild = null;
    var connectEvent = null;

        //This is horrible, fix me later
    if (!oldChannel) {
        member = newState.member;
        guild = newState.guild;
        connectEvent = true;
    } else if (!newChannel) {
        member = oldState.member;
        guild = oldState.guild;
        connectEvent = false;
    } else if (oldChannel.guild.id != newChannel.guild.id) {
        member = newState.member;
        guild = newState.guild;
        connectEvent = true;
    } else {
        member = oldState.member;
        guild = oldState.guild;
        connectEvent = false;
    }

    const serverID = guild.id;

    // check the server config and see if they have logging turned on
    // is the bot setup on the server?
    if (serverConfig[serverID].setupNeeded) {
      return;
    }

    // is logging turned on?
    if (!serverConfig[serverID].logging.enable || !serverConfig[serverID].logging.voice.enable ) {
      return;
    }

    // is logging channel defined?
    if (serverConfig[serverID].logging.loggingChannel == "Not Set Up") {
      return addToLog(
        "Fatal Error",
        "logOnVoiceStateUpdate",
        "null",
        guild.name,
        "null",
        "The logging output channel is not setup.",
        client
      );
    }

    // any time voice state updated execute the following code
    if (connectEvent) {
        console.log(member);
      const embMsg = new EmbedBuilder()
        .setTitle(`User ${member.user.username} connected!`)
        .setColor("#ffffff")
        .setDescription("test we'll figure it out later ben I'm tired")
        .setTimestamp();

      // Trigger every time a connection or disconnection is made to a channel
      // wrap in message (embeds)
      // post message to channel
      await client.channels.cache
        .get(serverConfig[serverID].logging.loggingChannel)
        .send({ embeds: [embMsg] });

    } else if (connectEvent != null || !connectEvent) {
      const embMsg = new EmbedBuilder()
        .setTitle(`User ${member.user.username} disconnected!`)
        .setColor("#ffffff")
        .setDescription("test we'll figure it out later ben I'm tired")
        .setTimestamp();

      // Trigger every time a connection or disconnection is made to a channel
      // wrap in message (embeds)
      // post message to channel
      await client.channels.cache
        .get(serverConfig[serverID].logging.loggingChannel)
        .send({ embeds: [embMsg] });
    } else {
        //more error logging
    }
  });
}

//#endregion

//#region exports
module.exports = { joinToCreateHandling, logOnVoiceStateUpdate };
//#endregion
