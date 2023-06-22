import { BsLink } from 'react-icons/bs';
import { defineField, defineType } from 'sanity';
import { IconInput } from '../../../../components/icon-input';
import { localeStringValidation } from '../../../../studio/validation/locale-validation';

export const notFoundLink = defineType({
  name: 'notFoundPageLinks',
  title: 'Not Found Page Links',
  type: 'document',
  icon: BsLink,
  fields: [
    defineField({
      title: 'Link Label',
      description: 'Het label voor de link.',
      name: 'linkLabel',
      type: 'localeString',
      validation: localeStringValidation((rule) => rule.required()),
    }),
    defineField({
      title: 'Link URL',
      description: 'De bestemming van de link. Gebruik altijd relatieve URLs.',
      name: 'linkUrl',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: 'Icon',
      description: 'Optioneel icoon voor de link. Wordt links van de tekst getoond.',
      name: 'linkIcon',
      type: 'string',
      components: {
        input: IconInput,
      },
    }),
  ],
  preview: {
    select: {
      title: 'linkLabel.nl',
      subtitle: 'linkUrl',
    },
  },
});
