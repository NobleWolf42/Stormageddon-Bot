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
import { warnCustom, embedCustomDM } from '../helpers/embedMessages.js';
//#endregion
//#region This creates the jtc command with the information about it
const jtcCommand = {
    name: 'jointocreate',
    type: ['Guild'],
    aliases: ['jtc'],
    coolDown: 0,
    class: 'misc.',
    usage: 'jointocreate name ***YOUR NAME HERE***',
    description: 'Allows you to change the settings for your voice channel.',
    execute(message, args, client, distube, collections) {
        return __awaiter(this, void 0, void 0, function* () {
            const voiceChannel = message.member.voice.channel;
            if (collections.voiceGenerator.get(message.member.id) && collections.voiceGenerator.findKey((test) => test == message.member.id) == voiceChannel.id) {
                switch (args[0]) {
                    case 'name':
                        var newName = '';
                        for (let i = 1; i < args.length; i++) {
                            if (i != args.length - 1) {
                                newName += `${args[i]} `;
                            }
                            else {
                                newName += `${args[i]}`;
                            }
                        }
                        if (newName.length > 22 || newName.length < 1) {
                            warnCustom(message, 'Not a valid name length, Length must be between 1-22 characters long!', this.name);
                        }
                        else {
                            voiceChannel.edit({ name: newName });
                            embedCustomDM(message, 'Success:', '#355E3B', 'Channel name changed successfully!');
                        }
                        break;
                    default:
                        warnCustom(message, 'Not a valid Join to Create command!', this.name);
                        break;
                }
            }
            else {
                warnCustom(message, 'You do not own a voice channel!', this.name);
            }
            return;
        });
    },
};
//#endregion
//#region Exports
export default jtcCommand;
//#endregion
