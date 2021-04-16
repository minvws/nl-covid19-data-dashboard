import React from 'react';

export default {
  widgets: [
    {
      name: 'document-list',
      options: {
        title: 'Niet-gepubliceerde documenten',
        query: '*[_id in path("drafts.**")] | order(_updatedAt desc)',
      },
    },
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
    {
      type: '__experimental_group',
      widgets: [
        {
          name: 'document-list',
          options: {
            title: (
              <span>
                Lokalize zonder Engelse vertaling
                <br />
                <em style={{ fontSize: '0.8em' }}>gepubliceerd</em>
              </span>
            ),
            query: `
              *[
                (_type == "lokalizeText" && (!defined(text.en) || text.en == "")) &&
                !(_id in path("drafts.**"))
              ]
              `,
          },
        },
        {
          name: 'document-list',
          options: {
            title: (
              <span>
                Lokalize zonder Engelse vertaling
                <br />
                <em style={{ fontSize: '0.8em' }}>niet-gepubliceerd</em>
              </span>
            ),
            query: `
              *[
                (_type == "lokalizeText" && (!defined(text.en) || text.en == "")) &&
                (_id in path("drafts.**"))
              ]
              `,
          },
        },
      ],
    },
  ],
};
