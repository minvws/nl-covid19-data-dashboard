import { MetricConfig } from './types';

const GREEN = '#69c253';
const YELLOW = '#D3A500';
const RED = '#f35065';

/**
 * Maybe we can make this stricter, but if I use keyof National now, it
 * complains that I haven't implemented all properties of national. So for now
 * they are all the same and vague.
 */
type VrConfig = Record<string, Record<string, MetricConfig>>;

export const vr: VrConfig = {};
