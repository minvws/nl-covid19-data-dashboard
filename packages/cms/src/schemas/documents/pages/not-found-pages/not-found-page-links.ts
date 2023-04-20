import { KpiIconInput } from '../../../../components/portable-text/kpi-configuration/kpi-icon-input';
import { REQUIRED } from '../../../../validation';

export const themeLink = {
  name: 'notFoundPageLinks',
  title: 'Not Found Page Links',
  type: 'document',
  fields: [
    {
      title: 'Link Label',
      description: 'Het label voor de link.',
      name: 'linkLabel',
      type: 'localeString',
      validation: REQUIRED,
    },
    {
      title: 'Link URL',
      description: 'De bestemming van de link. Gebruik altijd relatieve URLs.',
      name: 'linkUrl',
      type: 'string',
      validation: REQUIRED,
    },
    {
      title: 'Icon',
      description: 'Optioneel icoon voor de link. Wordt links van de tekst getoond.',
      name: 'linkIcon',
      type: 'string',
      inputComponent: KpiIconInput,
    },
  ],
  preview: {
    select: {
      title: 'linkLabel.nl',
      subtitle: 'linkUrl',
    },
  },
};
