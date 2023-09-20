import { defineField, defineType } from 'sanity';

export const linkType = defineType({
  name: 'linkType',
  title: 'Linktype',
  type: 'object',
  fields: [
    defineField({
      name: 'linkType',
      title: 'Linktype',
      description: 'Selecteer het type link op basis van of het een e-mail, telefoon of normaal link is.',
      type: 'string',
      options: {
        list: [
          { value: 'regular', title: 'Normaal' },
          { value: 'email', title: 'E-mail' },
          { value: 'phone', title: 'Telefoon' },
        ],
        layout: 'dropdown',
      },
    }),
  ],
});
