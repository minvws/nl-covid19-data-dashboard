import { MetricConfig } from './types';
import { colors } from '~/style/theme';

const GREEN = colors.data.gradient.green;
const YELLOW = colors.data.gradient.yellow;
const RED = colors.data.gradient.red;

/**
 * Maybe we can make this stricter, but if I use keyof National now, it
 * complains that I haven't implemented all properties of national. So for now
 * they are all the same and vague.
 */
type GmConfig = Record<string, Record<string, MetricConfig>>;

export const gm: GmConfig = {};
