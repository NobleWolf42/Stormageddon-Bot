//#region Function that capitalizes the first letter of a passed word
/**
 * This function capitalizes the first letter of a passed word.
 * @param {string} word - String that is a single lowercase word
 * @returns {string} A capitalized version of the word passed in, or void if no word is passed
 */
function capitalize(word) {
    if (word != undefined) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }
    return;
}
//#endregion

//#region exports
module.exports = { capitalize };
//#endregion