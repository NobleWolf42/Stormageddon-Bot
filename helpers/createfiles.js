//#region Dependancies
const { existsSync, writeFileSync } = require('fs');
//#endregion

//#region Creates missing files on start
function createJSONfiles() {

    var emptyfile = {};

    if (!existsSync("./data/botprefix.json")) {
        writeFileSync("./data/botprefix.json", JSON.stringify(emptyfile), function(err) {
            if (err) {
                console.log(err);
            }
        });
    }
    
    if (!existsSync("./data/serverconfig.json")) {
        writeFileSync("./data/serverconfig.json", JSON.stringify(emptyfile), function(err) {
            if (err) {
                console.log(err);
            }
        });
    }
}
//#endregion

//#region exports
module.exports = { createJSONfiles };
//#endregion