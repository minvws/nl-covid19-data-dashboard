import { Rule } from '~/sanity';

export const REQUIRED_MIN_MAX = (rule: Rule, min: number, max: number) => rule.required().min(min).max(max);
export const REQUIRED = (rule: Rule) => rule.required();
