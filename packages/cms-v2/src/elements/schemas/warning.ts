import { commonFields, commonPreview } from './shared';

export const warning = {
  name: 'warning',
  type: 'document',
  title: 'Waarschuwing',
  fields: [
    ...commonFields,
    {
      title: 'Waarschuwing',
      name: 'warning',
      type: 'string',
      description: 'De hier ingevulde tekst als waarschuwing voor bijv. tijdelijke inaccuraatheid van de data. Laat leeg om de waarschuwing te verbergen.',
    },
  ],
  preview: commonPreview,
};
