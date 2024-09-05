var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//#region Import
import { EmbedBuilder } from 'discord.js';
import { errorCustom, warnCustom, warnDisabled } from '../helpers/embedMessages.js';
import { MongooseServerConfig } from '../models/serverConfigModel.js';
//#endregion
//#region This exports the modmail command with the information about it
const modMailCommand = {
    name: 'modmail',
    type: ['DM'],
    aliases: [],
    coolDown: 15,
    class: 'direct',
    usage: '!modmail ***SERVER-NAME***, ***MESSAGE*** ',
    description: 'Whisper via Stormageddon to all moderators for the specified server.',
    execute(message, args, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const newArgs = args.join(' ').split(', ');
            let serverID = null;
            const servername = newArgs[0];
            const content = newArgs[1];
            client.guilds.cache.forEach(function (key) {
                if (key.name == servername) {
                    serverID = key.id;
                }
            });
            const serverConfig = (yield MongooseServerConfig.findById(serverID).exec()).toObject();
            if (serverID != 0 && serverConfig != undefined) {
                if (serverConfig[serverID].modMail.enable) {
                    for (const key of serverConfig.modMail.modList) {
                        const mod = yield client.users.fetch(key);
                        const embMsg = new EmbedBuilder()
                            .setTitle(`Mod Mail from: ${servername}`)
                            .setColor('#0B6E29')
                            .setDescription(content)
                            .setFooter({
                            text: `Requested by ${message.author.tag}`,
                            iconURL: null,
                        })
                            .setTimestamp();
                        mod.send({ embeds: [embMsg] });
                    }
                }
                else {
                    return warnDisabled(message, 'modMail', this.name);
                }
            }
            else if (serverConfig[serverID] == undefined) {
                return errorCustom(message, `The \`!setup\` command has not been run on \`${servername}\` yet.`, this.name, client);
            }
            else {
                return warnCustom(message, 'The server you specified does not have this bot, or you failed to specify a server.', this.name);
            }
        });
    },
};
//#endregion
//#region Exports
export default modMailCommand;
//#endregion
