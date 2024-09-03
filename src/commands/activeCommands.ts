import { Command } from '../models/commandModel.js';
import changePrefixCommand from './changePrefix.js';
import infoCommand from './info.js';
import playCommand from './play.js';
import sayCommand from './say.js';
import testCommand from './test.js';
import createAutoRoleCommand from './createRoleMessage.js';

const activeCommands: Command[] = [infoCommand, changePrefixCommand, testCommand, playCommand, sayCommand, createAutoRoleCommand];

export { activeCommands };
