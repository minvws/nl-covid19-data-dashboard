import { REQUIRED } from '../../../../validation';
import { KpiIconInput } from '../../../../components/portable-text/kpi-configuration/kpi-icon-input';

export const themeLink = {
  name: 'notFoundPageLinks',
  title: 'Not Found Page Links',
  type: 'document',
  fields: [
    {
      title: 'Link Label',
      description: 'If a link is configured, then a label must be provided.',
      name: 'linkLabel',
      type: 'localeString',
      validation: REQUIRED,
    },
    {
      title: 'Link URL',
      description: 'If a link is configured, then a destination URL must be provided.',
      name: 'linkUrl',
      type: 'url',
      validation: REQUIRED,
    },
    {
      title: 'Icon',
      description: 'If a link is configured, you can choose to display an icon to the left of the link label.',
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
