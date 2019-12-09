//#region capitalize
function capitalize(word) {
    return ("" + word.charAt(0).toUpperCase() + word.slice(1));
}
//#endregion

//#region combineArray
function combineArray (array, start) {
    var text = '';

    for (i = start; i < array.length; i++) {
        if (array.length != (start + 1)) {
            if (i < (array.length - start + 1)) {
                text += (array[i] + ' ');
            }
            else {
                text += array[i];
            }
        }
        else {
            if (array[i] != undefined) {
                text += array[i + 1];
            }
        }
    }
    console.log(text);

    return text;
}
//#endregion

//#region exports
module.exports = { capitalize, combineArray };
//#endregion