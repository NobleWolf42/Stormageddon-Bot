import { Command } from '../models/command.js';
import changePrefixCommand from './changeprefix.js';
import infoCommand from './info.js';
import testCommand from './test.js';

const activeCommands: Command[] = [infoCommand, changePrefixCommand, testCommand];

export { activeCommands };
