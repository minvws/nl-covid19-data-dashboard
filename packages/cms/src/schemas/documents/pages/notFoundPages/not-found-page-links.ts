import { REQUIRED } from '../../../../validation';
import { KpiIconInput } from '../../../../components/portable-text/kpi-configuration/kpi-icon-input';

export const themeLink = {
  name: 'notFoundPageLinks',
  title: 'Not Found Page Links',
  type: 'document',
  fields: [
    {
      title: 'Link Label',
      description: 'The text to show for the link.',
      name: 'linkLabel',
      type: 'localeString',
      validation: REQUIRED,
    },
    {
      title: 'Link URL',
      description: 'The destination URL for this link.',
      name: 'linkUrl',
      type: 'url',
      validation: REQUIRED,
    },
    {
      title: 'Icon',
      description: 'The icon to use for this link. It will be shown to the left of this link.',
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
