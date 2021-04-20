export default {
  widgets: [
    {
      type: '__experimental_group',
      layout: {
        width: 'full',
      },
      widgets: [
        {
          name: 'document-list',
          options: {
            title: 'Niet-vertaalde Lokalize-keys',
            limit: 100,
            query: `
              *[_type == "lokalizeText" && (!defined(text.en) || text.en == "")] | order(_updatedAt asc)
              `,
          },
        },
        {
          name: 'document-list',
          options: {
            title: 'Niet-gepubliceerde documenten',
            query: '*[_id in path("drafts.**")] | order(_updatedAt desc)',
          },
        },
        { name: 'deploy' },
      ],
    },
    {
      type: '__experimental_group',
      layout: {
        width: 'full',
      },
      widgets: [
        {
          name: 'document-list',
          options: {
            title: 'Laatst gewijzigde artikelen',
            order: '_updatedAt desc',
            types: ['article'],
            createButtonText: 'Nieuw artikel',
          },
        },
        {
          name: 'document-list',
          options: {
            title: 'Laatst gewijzigde weekberichten',
            order: '_updatedAt desc',
            types: ['editorial'],
            createButtonText: 'Nieuw weekbericht',
          },
        },
      ],
    },
  ],
};
