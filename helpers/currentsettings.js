//#region Dependancies
const { readFileSync } = require('fs');
//#endregion

//#region update configfile
function updateConfigFile() {
    serverConfig = JSON.parse(readFileSync('./data/serverconfig.json', 'utf8'));
    return serverConfig;
}
//#endregion

//#region Module Exports
module.exports = { updateConfigFile };
//#endregion