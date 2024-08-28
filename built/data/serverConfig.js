"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var serverConfigs = [
    {
        guildID: '644966355875135499',
        setupNeeded: false,
        autoRole: {
            enable: true,
            embedMessage: 'heal',
            embedFooter: 'If you do not receive the role try reacting again.',
            roles: ["Sona's DJs", 'Stormageddon Bot Contributor'],
            reactions: ['<:scareddog:818542767449702420>', '🐕'],
        },
        joinRole: { enabled: true, role: 'Queue Bot Contributor' },
        music: { enable: true, djRoles: "Sona's DJs", textChannel: 'botspam' },
        general: {
            adminRoles: ['Server Admin'],
            modRoles: ['Server Admin', 'Some people the devs know'],
        },
        modMail: { modList: ['201665936049176576'], enable: true },
        JTCVC: { enable: true, voiceChannel: '1259031022658650132' },
        blame: {
            enable: true,
            cursing: true,
            offset: -2,
            permList: [],
            rotateList: ['HypersonicWalrus', 'NobleWolf42', 'End3rman07', 'Chris Cugs', '--Thor--', 'spacewulf'],
        },
    },
];
