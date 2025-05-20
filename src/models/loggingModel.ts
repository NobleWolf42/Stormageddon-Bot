//#region LogType Enum
enum LogType {
    Success = 'Success',
    Warning = 'Warning',
    Alert = 'Alert',
    FatalError = 'Fatal Error',
    None = 'None',
}
//#endregion

//#region ErrorType Enum
enum ErrorType {
    PersonExists = 'PersonExists',
    PersonNotExists = 'PersonNotExists',
}
//#endregion

//#region Log interface
class Log {
    Log: string;
    Date: string;
    Code: LogType;

    constructor(code: LogType, log: string = '', date: string = new Date().toUTCString()) {
        this.Log = log;
        this.Date = date;
        this.Code = code;
    }
}
//#endregion

//#region Log File
interface LogFile {
    logging: Log[];
}
//#endregion

//#region Exports
export { LogType, Log, ErrorType, LogFile };
//#endregion
