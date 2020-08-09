//#region Dependancies
const { readFileSync } = require('fs');
var config = JSON.parse(readFileSync('./data/serverconfig.json', 'utf8'));
const { updateConfigFile } = require('../helpers/currentsettings.js');
//#endregion

//#region code that happens when someone joins a server
function serverJoin(client) {
   config = updateConfigFile();
   client.on('guildMemberAdd', (guildMember) => {
      if (config[guildMember.guild.id].autorole.joinroleenabled) {
         guildMember.addRole(guildMember.guild.roles.find(role => role.name === config[guildMember.guild.id].autorole.joinrole));
      }
   });
}
//#endregion

//#region exports
module.exports = { serverJoin };
//#endregion