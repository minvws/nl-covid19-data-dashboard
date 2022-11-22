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
            title: 'Niet-gepubliceerde documenten',
            query: '*[_id in path("drafts.**") && (defined(text))] | order(_updatedAt desc)',
          },
        },
        {
          name: 'document-list',
          options: {
            title: 'Recent gepubliceerde documenten',
            limit: 30,
            query: '*[!(_id in path("drafts.**")) && (defined(text)) && (defined(key))] | order(_publishedAt desc)',
          },
        },
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

    {
      type: '__experimental_group',
      layout: {
        width: 'full',
      },
      widgets: [
        {
          name: 'document-list',
          options: {
            title: 'Onvertaalde Lokalize teksten',
            limit: 50,
            query: `
              *[_type == "lokalizeText" && (!defined(text.en) || text.en == "")] | order(_updatedAt desc)
              `,
          },
        },
        {
          name: 'document-list',
          options: {
            title: 'Nieuwe Lokalize teksten',
            limit: 50,
            query: `
              *[_type == "lokalizeText" && is_newly_added == true] | order(key asc)
              `,
          },
        },
      ],
    },
  ],
};
