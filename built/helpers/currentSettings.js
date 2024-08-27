//#region Dependencies
var readFileSync = require('fs').readFileSync;
//#endregion
//#region Reads the current serverConfig.json file into memory
/**
 * This function reads the current settings in serverConfig.json and returns the JSON.
 * @returns {JSON} Most recent iteration of the serverConfig.json file
 */
function updateConfigFile() {
    serverConfig = JSON.parse(readFileSync('./data/serverConfig.json', 'utf8'));
    return serverConfig;
}
//#endregion
//#region Module Exports
module.exports = { updateConfigFile: updateConfigFile };
//#endregion
