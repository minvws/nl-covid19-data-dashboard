import { snakeCase } from 'change-case';
import { isDefined } from 'ts-is-present';
import { commonFields, commonPreview, scopes } from './shared';

export const choropleth = {
  name: 'choropleth',
  type: 'document',
  title: 'Choropleth',
  fields: [...commonFields],
  preview: commonPreview,
};
