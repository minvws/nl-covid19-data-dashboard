import { defineType } from 'sanity';
import { SHARED_TREND_ICON_FIELDS } from '../../trend-icon';

export const thermometerTrendIcon = defineType({
  name: 'thermometerTrendIcon',
  type: 'document',
  title: 'Trend icon',
  fields: [...SHARED_TREND_ICON_FIELDS.map((field) => ({ ...field, validation: undefined }))],
});
