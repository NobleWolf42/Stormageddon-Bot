import { Command } from '../models/commandModel.js';
import addModCommand from './addMod.js';
import agifyCommand from './agify.js';
import autoPlayCommand from './autoPlay.js';
import blameCommand from './blame.js';
import bugReportCommand from './bugReport.js';
import changePrefixCommand from './changePrefix.js';
import clearCommand from './clear.js';
import createRoleMessageCommand from './createRoleMessage.js';
import destiny2Command from './destiny2.js';
import devSendCommand from './devSend.js';
import helpCommand from './help.js';
import infoCommand from './info.js';
import issCommand from './iss.js';
import jtcCommand from './jtc.js';
import logsCommand from './logs.js';
import loopCommand from './loop.js';
import lyricsCommand from './lyrics.js';
import modMailCommand from './modMail.js';
import pauseCommand from './pause.js';
import playCommand from './play.js';
import playNextCommand from './playNext.js';
import quoteCommand from './quote.js';
import removeCommand from './remove.js';
import removeModCommand from './removeMod.js';
import resumeCommand from './resume.js';
import sayCommand from './say.js';
import setCommand from './set.js';
import setupCommand from './setup.js';
import showQueueCommand from './showqueue.js';
import shuffleCommand from './shuffle.js';
import skipCommand from './skip.js';

const activeCommands: Command[] = [
    addModCommand,
    agifyCommand,
    autoPlayCommand,
    blameCommand,
    bugReportCommand,
    changePrefixCommand,
    clearCommand,
    createRoleMessageCommand,
    destiny2Command,
    devSendCommand,
    helpCommand,
    infoCommand,
    issCommand,
    jtcCommand,
    logsCommand,
    loopCommand,
    lyricsCommand,
    modMailCommand,
    pauseCommand,
    playCommand,
    playNextCommand,
    quoteCommand,
    removeCommand,
    removeModCommand,
    resumeCommand,
    sayCommand,
    setCommand,
    setupCommand,
    showQueueCommand,
    shuffleCommand,
    skipCommand,
];

export { activeCommands };
