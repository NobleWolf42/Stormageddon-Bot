//#region Function that will give you a random number between 0 and the max number passed
/**
 * This function will give you a random number between 0 and the max number passed.
 * @param max - Maximum integer for the random integer
 * @returns A random integer from 0 to max
 */
function getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
}
//#endregion

//#region Exports
export { getRandomInt };
//#endregion
