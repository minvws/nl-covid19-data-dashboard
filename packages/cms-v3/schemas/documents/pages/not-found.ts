import { defineField, defineType } from 'sanity';

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
      of: [{ type: 'reference', to: { type: 'notFoundPageItem' } }],
      // TODO: properly type this
      validation: (rule: any) => [
        rule.required(),

        // This will populate error messages and stop the document from being published.
        rule.custom((value: string | any[]) => {
          if (value && value?.length > 4) {
            return "Je kunt maximaal vier pagina's aan deze lijst toevoegen.";
          }

          return true;
        }),
      ],
    }),
  ],
});
