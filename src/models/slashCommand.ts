import { Client, Interaction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from 'discord.js';
import { DisTube } from 'distube';

interface SlashCommand {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    execute(client: Client, interaction: Interaction, distube: DisTube): Promise<void>;
}

export { SlashCommand };
