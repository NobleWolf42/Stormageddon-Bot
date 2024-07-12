//#region Helpers
const { warnCustom, embedCustomDM } = require("../helpers/embedMessages.js");
//#endregion

//#region This exports the set command with the information about it
module.exports = {
    name: "jointocreate",
    type: ['Guild'],
    aliases: ["jtc"],
    coolDown: 0,
    class: 'misc.',
    usage: 'jointocreate name ***YOUR NAME HERE***',
    description: "Allows you to change the settings for your voice channel.",
    execute(message, args, client, distube) {
        const voiceChannel = message.member.voice.channel;

        if (client.voiceGenerator.get(message.member.id) && client.voiceGenerator.get(message.member.id) == voiceChannel.id) {
            switch (args[0]) {
                case "name":
                    var newName = "";
                    
                    for (i = 1; i < args.length; i++) {
                        if (i != (args.length - 1)) {
                            newName += `${args[i]} `;
                        } else {
                            newName += `${args[i]}`;
                        }
                    };

                    if (newName.length > 22 || newName.length < 1) {
                        warnCustom(message, "Not a valid name length, Length must be between 1-22 characters long!", module.name);
                    } else {
                        voiceChannel.edit({ name: newName});
                        embedCustomDM(message, "Success:", "#355E3B", "Channel name changed successfully!");
                    }
                break;

                default:
                    warnCustom(message, "Not a valid Join to Create command!", module.name);
                break;
            }
        } else {
            warnCustom(message, "You do not own a voice channel!", module.name);
        };
        return;
    }
}
//#endregion
