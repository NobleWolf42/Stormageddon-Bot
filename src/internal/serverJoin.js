//#region Helpers
const { Client } = require('discord.js');
const { updateConfigFile } = require('../helpers/currentSettings.js');
//#endregion

//Refreshing the serverConfig from serverConfig.json
var serverConfig = updateConfigFile();

//#region Function that listens for someone to join a server and then gives them a role if this feature is enabled
/**
 * This function listens for someone to join a server and then gives them a role if this feature is enabled.
 * @param {Client} client - Discord.js Client Object
 */
function serverJoin(client) {
    serverConfig = updateConfigFile();
    client.on('guildMemberAdd', (guildMember) => {
        if (serverConfig[guildMember.guild.id].autoRole.joinroleenabled) {
            guildMember.addRole(
                guildMember.guild.roles.find(
                    (role) =>
                        role.name ===
                        serverConfig[guildMember.guild.id].autoRole.joinrole
                )
            );
        }
    });
}
//#endregion

//#region exports
module.exports = { serverJoin };
//#endregion
