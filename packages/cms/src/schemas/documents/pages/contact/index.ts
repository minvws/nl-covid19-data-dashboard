import { defineArrayMember, defineField, defineType } from 'sanity';

export const contact = defineType({
  name: 'contact',
  title: 'Contact Page',
  description: 'Dit is het startpunt voor het configureren van de contactpagina. Voeg er secties aan toe met behulp van de onderstaande lijst.',
  type: 'document',
  fields: [
    defineField({
      name: 'contactPageGroups',
      title: 'Pagina Groepen',
      description: 'Groepen toevoegen, verwijderen of opnieuw rangschikken op de contactpagina.',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: { type: 'contactPageGroup' } })],
      validation: (rule) => rule.required().min(3).error('De contactpagina moet minimaal 3 secties bevatten.'),
    }),
  ],
  preview: {
    select: {
      title: 'title.nl',
    },
  },
});
