import { curveLinear, curveStep } from '@visx/curve';

export const curves = {
  linear: curveLinear,
  step: curveStep,
} as const;
