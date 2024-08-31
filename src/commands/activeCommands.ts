import { Command } from '../models/command.js';
import changePrefixCommand from './changeprefix.js';
import infoCommand from './info.js';

const activeCommands: Command[] = [infoCommand, changePrefixCommand];

export { activeCommands };
