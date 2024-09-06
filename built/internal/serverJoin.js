var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MongooseServerConfig } from '../models/serverConfigModel.js';
//#endregion
//#region Function that listens for someone to join a server and then gives them a role if this feature is enabled
/**
 * This function listens for someone to join a server and then gives them a role if this feature is enabled.
 * @param client - Discord.js Client Object
 */
function serverJoin(client) {
    client.on('guildMemberAdd', (guildMember) => __awaiter(this, void 0, void 0, function* () {
        //Gets serverConfig from database
        const serverConfig = (yield MongooseServerConfig.findById(guildMember.guild.id).exec()).toObject();
        if (serverConfig.joinRole.enable) {
            guildMember.roles.add(guildMember.guild.roles.resolve(serverConfig.joinRole.role));
        }
    }));
}
//#endregion
//#region exports
export { serverJoin };
//#endregion
