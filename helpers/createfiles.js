//#region Dependancies
var fs = require('fs');
//#endregion

//#region Creates missing files on start
function createJSONfiles() {

    var emptyfile = {};

    if (!fs.existsSync("./data/botprefix.json")) {
        fs.writeFileSync("./data/botprefix.json", JSON.stringify(emptyfile), function(err) {
            if (err) {
                console.log(err);
            }
        });
    }
    
    if (!fs.existsSync("./data/serverconfig.json")) {
        fs.writeFileSync("./data/serverconfig.json", JSON.stringify(emptyfile), function(err) {
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