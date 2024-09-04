//#region Imports
import { warnCustom, embedCustomDM } from '../helpers/embedMessages.js';
import { Command } from '../models/commandModel.js';
//#endregion

//#region This creates the jtc command with the information about it
const jtcCommand: Command = {
    name: 'jointocreate',
    type: ['Guild'],
    aliases: ['jtc'],
    coolDown: 0,
    class: 'misc.',
    usage: 'jointocreate name ***YOUR NAME HERE***',
    description: 'Allows you to change the settings for your voice channel.',
    async execute(message, args, client, distube, collections) {
        const voiceChannel = message.member.voice.channel;

        if (collections.voiceGenerator.get(message.member.id) && collections.voiceGenerator.findKey((test) => test == message.member.id) == voiceChannel.id) {
            switch (args[0]) {
                case 'name':
                    var newName = '';

                    for (let i = 1; i < args.length; i++) {
                        if (i != args.length - 1) {
                            newName += `${args[i]} `;
                        } else {
                            newName += `${args[i]}`;
                        }
                    }

                    if (newName.length > 22 || newName.length < 1) {
                        warnCustom(message, 'Not a valid name length, Length must be between 1-22 characters long!', this.name);
                    } else {
                        voiceChannel.edit({ name: newName });
                        embedCustomDM(message, 'Success:', '#355E3B', 'Channel name changed successfully!');
                    }
                    break;

                default:
                    warnCustom(message, 'Not a valid Join to Create command!', this.name);
                    break;
            }
        } else {
            warnCustom(message, 'You do not own a voice channel!', this.name);
        }
        return;
    },
};
//#endregion

//#region Exports
export default jtcCommand;
//#endregion
