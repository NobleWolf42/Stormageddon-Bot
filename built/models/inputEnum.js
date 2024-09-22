var ButtonAction;
(function (ButtonAction) {
    ButtonAction["VCPrivate"] = "vChannelPrivate";
    ButtonAction["VCPublic"] = "vChannelPublic";
    ButtonAction["VCHide"] = "vChannelHide";
    ButtonAction["VCShow"] = "vChannelShow";
    ButtonAction["VCEdit"] = "vChannelEdit";
    ButtonAction["VCKick"] = "vChannelKick";
    ButtonAction["VCBan"] = "vChannelBan";
    ButtonAction["VCNewOwner"] = "vChannelChangeOwner";
    ButtonAction["VCClaim"] = "vChannelClaimChannel";
})(ButtonAction || (ButtonAction = {}));
var TextAction;
(function (TextAction) {
    TextAction["VCNewName"] = "vChannelNameEdit";
})(TextAction || (TextAction = {}));
var ModalAction;
(function (ModalAction) {
    ModalAction["VCNameModal"] = "vChannelNameModal";
})(ModalAction || (ModalAction = {}));
var SelectAction;
(function (SelectAction) {
    SelectAction["VCKickUser"] = "vChannelKickSelect";
})(SelectAction || (SelectAction = {}));
export { ButtonAction, TextAction, ModalAction, SelectAction };
//hi
