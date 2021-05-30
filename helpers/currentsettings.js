//#region Dependancies
const { readFile } = require('fs');
//#endregion

//#region update configfile
function updateConfigFile() {
    var serverConfig = {};
    readFile('./data/serverconfig.json', 'utf8', function(err, data) {
        if (err) {
            console.log(err)
        }
        else {
            serverConfig = JSON.parse(data);
        }
    });
    return serverConfig;
}
//#endregion

//#region Module Exports
module.exports = { updateConfigFile };
//#endregion