import { defineArrayMember, defineField, defineType } from 'sanity';

const MAXIMUM_AMOUNT_OF_PAGES = 5;

export const notFound = defineType({
  name: 'notFoundPagesCollection',
  title: "404 Pagina's",
  type: 'document',
  fields: [
    defineField({
      name: 'notFoundPagesList',
      title: "Pagina's",
      description: 'Configureer elke 404 pagina. Voeg nieuwe items toe aan specifieke 404 pagina\'s. Selecteer tijdens het toevoegen een "Pagina Type".',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: { type: 'notFoundPageItem' } })],
      validation: (rule) => [
        rule.required(),

        // This will populate error messages and stop the document from being published.
        rule.custom((value) => {
          if (value && value.length > MAXIMUM_AMOUNT_OF_PAGES) {
            return `Je kunt maximaal ${MAXIMUM_AMOUNT_OF_PAGES} pagina's aan deze lijst toevoegen.`;
          }

          return true;
        }),
      ],
    }),
  ],
});
