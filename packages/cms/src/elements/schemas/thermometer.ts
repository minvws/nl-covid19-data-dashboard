import { commonFields, commonPreview } from './shared';

export const thermometer = {
  name: 'thermometer',
  type: 'document',
  title: 'Thermometer',
  fields: [
    ...commonFields,
    {
      title: 'Thermometer Event Collections',
      name: 'thermometerEventCollections',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'thermometerEventCollection' }] }],
    },
  ],
  preview: commonPreview,
};
