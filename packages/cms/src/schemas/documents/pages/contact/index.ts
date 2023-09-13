import { defineArrayMember, defineField, defineType } from 'sanity';

export const contact = defineType({
  name: 'contact',
  title: 'Contact Page',
  description:
    'Dit is het startpunt voor het configureren van de contactpagina. Stel een optionele titel voor de pagina in en voeg er secties aan toe met behulp van de onderstaande lijst.',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Pagina Titel',
      description: 'Configureer de titel voor de contactpagina. Het is niet verplicht dit veld in te vullen.',
      type: 'localeString',
    }),
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
