//#region LogType Enum
enum LogType {
    Success = 'Success',
    Warning = 'Warning',
    Alert = 'Alert',
    FatalError = 'Fatal Error',
    None = 'None',
}
//#endregion

//#region Log interface
class Log {
    Log: string;
    Date: string;
    Code: LogType;

    constructor(code: LogType, log: string = '', date: string = new Date().toTimeString()) {
        this.Log = log;
        this.Date = date;
        this.Code = code;
    }
}

//#region Exports
export { LogType, Log };
//#endregion
