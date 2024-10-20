interface BungieUser {
    supplementalDisplayName: string;
    iconPath: string;
    crossSaveOverride: number;
    isPublic: boolean;
    membershipType: number;
    membershipId: string;
    displayName: string;
}

interface D2User {
    LastSeenDisplayName: string;
    LastSeenDisplayNameType: number;
    iconPath: string;
    crossSaveOverride: number;
    applicableMembershipTypes: number[];
    isPublic: boolean;
    membershipType: number;
    membershipId: string;
    displayName: string;
    bungieGlobalDisplayName: string;
}

interface D2ClanData {
    Response: {
        detail: {
            groupId: string;
            name: string;
            groupType: number;
            membershipIdCreated: string;
            creationDate: string;
            modificationDate: string;
            about: string;
            tags: string[];
            memberCount: number;
            isPublic: boolean;
            isPublicTopicAdminOnly: boolean;
            motto: string;
            allowChat: boolean;
            isDefaultPostPublic: boolean;
            chatSecurity: number;
            locale: string;
            avatarImageIndex: number;
            homepage: number;
            membershipOption: number;
            defaultPublicity: number;
            theme: string;
            bannerPath: string;
            avatarPath: string;
            conversationId: string;
            enableInvitationMessagingForAdmins: boolean;
            banExpireDate: string;
            features: [object];
            remoteGroupId: string;
            clanInfo: [object];
        };
        founder: {
            memberType: number;
            isOnline: boolean;
            lastOnlineStatusChange: string;
            groupId: string;
            destinyUserInfo: D2User;
            bungieNetUserInfo: BungieUser;
            joinDate: string;
        };
        alliedIds: string[];
        allianceStatus: number;
        groupJoinInviteCount: number;
        currentUserMembershipsInactiveForDestiny: boolean;
        currentUserMemberMap: object;
        currentUserPotentialMemberMap: object;
    };
    ErrorCode: number;
    ThrottleSeconds: number;
    ErrorStatus: string;
    Message: string;
    MessageData: object;
}

//#region Exports
export { D2ClanData };
//#endregion
