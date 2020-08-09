//#region Dependancies
const { readFileSync } = require('fs');
//#endregion

//#region update configfile
function updateConfigFile() {
    cfg = JSON.parse(readFileSync('./data/serverconfig.json', 'utf8'));
    return cfg;
}
//#endregion

//#region Module Exports
module.exports = { updateConfigFile };
//#endregion