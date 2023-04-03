import { Rule } from '~/sanity';

export const notFoundPagesCollection = {
  name: 'notFoundPagesCollection',
  title: '404 Paginas',
  type: 'document',
  fields: [
    {
      name: 'notFoundPagesList',
      title: 'Paginas',
      description:
        'Configure each 404 page. Add a new item to configure a particular 404 page. When added, select a level from the dropdown list "Pagina Type" to get started. If you are unable to publish this page, please check the errors by hovering over the error icon next to the title above.',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'notFoundPageItem' } }],
      validation: (rule: Rule) => [
        rule.required(),

        // This will populate error messages and stop the document from being published.
        rule.custom((value: string | any[]) => {
          if (value && value?.length > 4) {
            return 'You can only add 4 items to this list.';
          }

          return true;
        }),
      ],
    },
  ],
};
