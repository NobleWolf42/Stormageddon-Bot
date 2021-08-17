//#region get random int function
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
//#endregion

//#region check to see if it is a number
function isInteger(value) {
    return /^\d+$/.test(value);
}
//#endregion

module.exports = { getRandomInt, isInteger };