//#region capitalize
function capitalize(word) {
    if (word != undefined) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }
    return
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
                text += array[i];
            }
        }
    }
    
    return text;
}
//#endregion

//#region exports
module.exports = { capitalize, combineArray };
//#endregion