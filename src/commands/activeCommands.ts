import { Command } from '../models/command.js';
import changePrefixCommand from './changePrefix.js';
import infoCommand from './info.js';
import playCommand from './play.js';
import testCommand from './test.js';

const activeCommands: Command[] = [infoCommand, changePrefixCommand, testCommand, playCommand];

export { activeCommands };
