//#region LogType Enum
var LogType;
(function (LogType) {
    LogType["Success"] = "Success";
    LogType["Warning"] = "Warning";
    LogType["Alert"] = "Alert";
    LogType["FatalError"] = "Fatal Error";
    LogType["None"] = "None";
})(LogType || (LogType = {}));
//#endregion
//#region ErrorType Enum
var ErrorType;
(function (ErrorType) {
    ErrorType["PersonExists"] = "PersonExists";
    ErrorType["PersonNotExists"] = "PersonNotExists";
})(ErrorType || (ErrorType = {}));
//#endregion
//#region Log interface
class Log {
    constructor(code, log = '', date = new Date().toTimeString()) {
        this.Log = log;
        this.Date = date;
        this.Code = code;
    }
}
//#region Exports
export { LogType, Log, ErrorType };
//#endregion
