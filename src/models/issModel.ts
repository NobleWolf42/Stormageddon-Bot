//#region ISSData interface
interface ISSData {
    people: [
        {
            craft: string;
            name: string;
        },
    ];
    number: number;
    message: string;
}
//#endregion

//#region Exports
export { ISSData };
//#endregion
