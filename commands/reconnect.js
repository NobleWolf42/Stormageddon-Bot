//#region This exports the reconnect command with the information about it
module.exports = {
    name: "reconnect",
    type: ['Guild'],
    aliases: ["rc"],
    coolDown: 0,
    class: 'music',
    usage: 'reconnect',
    description: "Reconnects the bot to the voice chat you are in.",
    execute(message) {
        const { channel } = message.member.voice;
        channel.join();
    }
}
//#endregion