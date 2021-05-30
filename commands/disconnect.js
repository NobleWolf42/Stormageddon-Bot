module.exports = {
    name: "disconnect",
    type: ['Guild'],
    aliases: ["dc"],
    cooldown: 0,
    class: 'music',
    usage: 'disconnect',
    description: "Disconnects the bot from the voice chat it is in.",
    execute(message) {
        message.guild.me.voice.channel.leave();
    }
};