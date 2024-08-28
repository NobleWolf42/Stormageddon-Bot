//#region Helpers
const { Client } = require('discord.js');
//#endregion

//#region Modules
import { MongooseServerConfig } from '../models/serverConfig';
//#endregion

//#region Function that listens for someone to join a server and then gives them a role if this feature is enabled
/**
 * This function listens for someone to join a server and then gives them a role if this feature is enabled.
 * @param {Client} client - Discord.js Client Object
 */
function serverJoin(client) {
    client.on('guildMemberAdd', async (guildMember) => {
        //Gets serverConfig from database
        var serverConfig = await MongooseServerConfig.findById(guildMember.guild.id).exec()[0];

        if (serverConfig.autoRole.joinroleenabled) {
            guildMember.addRole(guildMember.guild.roles.find((role) => role.name === serverConfig.autoRole.joinrole));
        }
    });
}
//#endregion

//#region exports
module.exports = { serverJoin };
//#endregion
