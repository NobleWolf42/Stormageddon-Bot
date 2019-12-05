//#region Dependancies
var fs = require('fs');
//#endregion

//#region Creates missing files on start
function createJSONfiles() {

    var emptyFile = {};

    if (!fs.existsSync("./data/botprefix.json")) {
        fs.writeFile("./data/botprefix.json", JSON.stringify(emptyFile), function(err) {
            if (err) {
                console.log(err);
            }
        });
    }
}

function updateFilevaribles(){
    prefixFile = JSON.parse(fs.readFileSync('./data/botprefix.json'));
}
//#endregion

//#region exports
module.exports = { createJSONfiles };
//#endregion