enum ButtonAction {
    VCPrivate = 'vChannelPrivate',
    VCPublic = 'vChannelPublic',
    VCHide = 'vChannelHide',
    VCShow = 'vChannelShow',
    VCEdit = 'vChannelEdit',
    VCKick = 'vChannelKick',
    VCBan = 'vChannelBan',
    VCNewOwner = 'vChannelChangeOwner',
    VCClaim = 'vChannelClaimChannel',
}
enum TextAction {
    VCNewName = 'vChannelNameEdit',
}
enum ModalAction {
    VCNameModal = 'vChannelNameModal',
}
enum SelectAction {
    VCKickUser = 'vChannelKickSelect',
    VCBanUser = 'vChannelBanSelect',
    VCNewOwnerAction = 'vChannelOwnerChange',
}

export { ButtonAction, TextAction, ModalAction, SelectAction };
//hi
