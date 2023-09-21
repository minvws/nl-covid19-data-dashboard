import { defineArrayMember, defineField, defineType } from 'sanity';
import { localeStringValidation } from '../../../../studio/validation/locale-validation';

export const contactPageGroup = defineType({
  name: 'contactPageGroup',
  title: 'Contactpaginagroep',
  description: 'Configureer een groep voor de contactpagina. Stel de titel voor een groep in en voeg er items aan toe.',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Groepstitel',
      type: 'localeString',
      description: 'Configureer de titel voor deze groep.',
      validation: localeStringValidation((rule) => rule.required()),
    }),
    defineField({
      name: 'contactPageGroupItems',
      title: 'Groep Items',
      type: 'array',
      description: 'Voeg items toe aan deze groep.',
      of: [defineArrayMember({ type: 'reference', to: { type: 'contactPageGroupItem' } })],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title.nl',
    },
  },
});
