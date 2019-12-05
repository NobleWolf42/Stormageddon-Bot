//#region Dependancies
var fs = require('fs');

var prefixFile = {};
//#endregion

//#region Prefix Changing
function prefixChange(newPrefix, serverid) {
    prefixFile[serverid] = {"prefix": newPrefix};

    fs.writeFile("../data/botprefix.json", JSON.stringify(prefixFile), (err) => {
        if (err) {
            console.error(err);
            return;
        };
    });
}
//#endregion

//#region exports
module.exports = { prefixChange };
//#endregion