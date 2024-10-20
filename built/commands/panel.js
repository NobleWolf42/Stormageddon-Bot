var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ActionRowBuilder, ComponentType, EmbedBuilder } from 'discord.js';
//#endregion
//#region This creates the info command with the information about it
const panelCommand = {
    name: 'panel',
    type: ['Guild'],
    aliases: ['voicecontrol'],
    coolDown: 60,
    class: 'voice',
    usage: 'vchannel',
    description: "Panel Test!",
    execute(message, _args, client, _distube, _collections, serverConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            //#region buttons
            const embMsg = new EmbedBuilder()
                .setTitle('Voice Channel Controls')
                .setColor('#0000FF')
                .setDescription(`${panel.user}'s channel\n`)
                .setTimestamp();
        });
    },
    const: buttons1 = new ActionRowBuilder().addComponents(private, public, hide, show),
    const: buttons2 = new ActionRowBuilder().addComponents(vChannelEdit, vChannelKick, vChannelBan),
    const: buttons3 = new ActionRowBuilder().addComponents(vChannelChangeOwner),
    nowPlayingMessage, [queue.id]:  = await queue.textChannel.send({
        embeds: [embMsg],
        components: [buttons1, buttons2],
    }),
    const: collector = nowPlayingMessage[queue.id].createMessageComponentCollector({
        componentType: ComponentType.Button,
    }),
    console, : .log('... OK')
    //#endregion
};
;
//#endregion
//#region Exports
export default panelCommand;
//#endregion
