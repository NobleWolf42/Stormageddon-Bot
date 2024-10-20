import { Client, Interaction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js';
import { DisTube } from 'distube';
import { ExtraCollections } from './extraCollectionsModel.js';

interface SlashCommand {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;
    execute(client: Client, interaction: Interaction, distube?: DisTube, collections?: ExtraCollections): Promise<void> | void;
}

export { SlashCommand };
