//#region Blame Command
var BlameSubCommands;
(function (BlameSubCommands) {
    BlameSubCommands["Add"] = "add";
    BlameSubCommands["AddPerm"] = "addperm";
    BlameSubCommands["Remove"] = "remove";
    BlameSubCommands["RemovePerm"] = "removeperm";
    BlameSubCommands["List"] = "list";
    BlameSubCommands["Fix"] = "fix";
})(BlameSubCommands || (BlameSubCommands = {}));
//#endregion
//#region Exports
export { BlameSubCommands };
//#endregion
