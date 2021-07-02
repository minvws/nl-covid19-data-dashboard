import { snakeCase } from 'change-case';
import { isDefined } from 'ts-is-present';
import { commonFields, commonPreview, scopes } from './shared';

export const kpi = {
  name: 'kpi',
  type: 'document',
  title: 'KPI',
  fields: [...commonFields],
  preview: commonPreview,
};
