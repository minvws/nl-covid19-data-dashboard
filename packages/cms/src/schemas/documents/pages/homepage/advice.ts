import { defineArrayMember, defineField, defineType } from 'sanity';
import { localeStringValidation, localeValidation } from '../../../../studio/validation/locale-validation';

export const advice = defineType({
  type: 'object',
  title: 'Adviezen',
  name: 'advice',
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      description: 'Configureer een titel. Wordt bovenaan in de Adviezen sectie getoond.',
      type: 'localeString',
      validation: localeStringValidation((rule) => rule.required()),
    }),
    defineField({
      name: 'description',
      title: 'Beschrijving',
      description: 'Configureer een beschrijving. Wordt onder de titel in de Adviezen sectie getoond.',
      type: 'localeRichContentBlock',
      validation: localeValidation((rule) => rule.required()),
    }),
    defineField({
      name: 'links',
      title: 'Links',
      description: 'Configureer een lijst van een of meer links. Wordt onder de beschrijving getoond in de Adviezen sectie.',
      type: 'array',
      of: [defineArrayMember({ type: 'link' })],
    }),
    defineField({
      name: 'image',
      title: 'Afbeelding',
      description: 'Configureer een afbeelding. Voorzie de afbeelding van een alt-tekst voor toegankelijkheidsdoeleinden.',
      type: 'image',
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: 'altText',
          title: 'Alt Text',
          description: 'De alt-tekst voor de afbeelding. Wordt voorgelezen door screen readers.',
          type: 'localeString',
          validation: localeStringValidation((rule) => rule.required()),
        }),
      ],
    }),
  ],
});
