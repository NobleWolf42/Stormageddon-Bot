//#region Dependancies
const { readFile } = require('fs');
//#endregion

//#region update configfile
function updateConfigFile() {
    serverConfig = JSON.parse(readFile('./data/serverconfig.json', 'utf8', function(err, data) {
        if (err) {
            console.log(err)
        }
        return data;
    }));
    return serverConfig;
}
//#endregion

//#region Module Exports
module.exports = { updateConfigFile };
//#endregion