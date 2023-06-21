import { Rule } from '~/sanity';
import { KpiIconInput } from '../../components/portable-text/kpi-configuration/kpi-icon-input';
import { localeStringValidation, localeValidation } from '../../language/locale-validation';
import { REQUIRED } from '../../validation';

export const cijferVerantwoordingItem = {
  title: 'Cijferverantwoordingen',
  name: 'cijferVerantwoordingItem',
  type: 'document',
  fieldsets: [
    {
      title: 'Metadata',
      name: 'metadata',
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
  ],
  fields: [
    {
      name: 'title',
      type: 'localeString',
      title: 'Titel',
      validation: localeStringValidation((rule) => rule.required()),
    },
    {
      title: 'Icoon',
      name: 'icon',
      type: 'string',
      inputComponent: KpiIconInput,
      validation: REQUIRED,
    },
    {
      title: 'Slug',
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title.nl',
      },
      fieldset: 'metadata',
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'content',
      type: 'localeBlock',
      title: 'Inhoud',
      validation: localeValidation((rule) => rule.required()),
    },
    {
      name: 'group',
      type: 'reference',
      to: [{ type: 'cijferVerantwoordingGroups' }],
      title: 'Groep',
      validation: (Rule: Rule) => Rule.reset().required(),
    },
  ],
  preview: {
    select: {
      title: 'title.nl',
      subtitle: 'group.group.nl',
    },
  },
};
