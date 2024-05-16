//#region Dependencies
const { existsSync, writeFileSync } = require('fs');
//#endregion

//#region Creates missing files on start
/**
 * This function creates the JSON files the bot requires to function if they do not already exist.
 */
function createJSONfiles() {

    var emptyfile = {};
    var d = new Date();
    var emptyLog = {
        "logging": [{
            "Log": "Rebuilt Log File",
            "Date": d,
            "Code": "None"
        }]
    };

    if (!existsSync("./data/botPrefix.json")) {
        writeFileSync("./data/botPrefix.json", JSON.stringify(emptyfile), function (err) {
            if (err) {
                console.log(err);
            }
        });
    }

    if (!existsSync("./data/serverConfig.json")) {
        writeFileSync("./data/serverConfig.json", JSON.stringify(emptyfile), function (err) {
            if (err) {
                console.log(err);
            }
        });
    }

    if (!existsSync("./data/errorLog.json")) {
        writeFileSync("./data/errorLog.json", JSON.stringify(emptyLog), function (err) {
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