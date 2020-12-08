import { MetricKeys } from '~/components/choropleth/shared';
import { colors } from '~/style/theme';
import { Regions } from '~/types/data';
import { MetricConfig } from './types';

const GREEN = colors.data.gradient.green;
const YELLOW = colors.data.gradient.yellow;
const RED = colors.data.gradient.red;

type VrMetricKey = MetricKeys<Regions>;
export type VrConfig = Partial<
  Record<VrMetricKey, Record<string, MetricConfig>>
>;

export const vr: VrConfig = {};
