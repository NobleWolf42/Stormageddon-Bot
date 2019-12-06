//#region Dependancies
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./data/serverconfig.json', 'utf8'));
var set = require('../commands/setsettings.js');
//#endregion

//#region code that happens when someone joins a server
function serverJoin(client) {
   config = set.updateConfigFile();
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