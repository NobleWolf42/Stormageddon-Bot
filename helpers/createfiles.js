//#region Dependancies
var { existsSync, writeFileSync } = require('fs');
//#endregion

//#region Creates missing files on start
function createJSONfiles() {

    var emptyfile = {};
    var d = new Date();
    var emptyLog = { "logging": [{
        "Log": "Rebuilt Log File",
        "Date": d,
        "Code": "None"
    }]};

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

    if (!existsSync("./data/errorlog.json")) {
        writeFileSync("./data/errorlog.json", JSON.stringify(emptyLog), function(err) {
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