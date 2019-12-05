//#region Set An Interval that only runs x times function (setIntervalTimes)
function setIntervalTimes(callback, delay, repetitions) {
    var x = 0;
    var intervalID = setInterval(function () {
        
        callback();

        if (++x === repetitions) {
            clearInterval(intervalID);
        }
    }, delay);
}
//#endregion

//#region exports
module.exports = { setIntervalTimes };
//#endregion