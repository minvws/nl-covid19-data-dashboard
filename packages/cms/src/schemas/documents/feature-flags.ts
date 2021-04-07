export default {
  name: 'featureFlags',
  type: 'document',
  title: 'Feature flags',
  fields: [
    {
      title: 'Feature flags',
      name: 'flags',
      description:
        'Met deze toggles kan je features aan of uit zetten op productie.',
      type: 'array',
      of: [
        {
          title: 'Feature flag',
          name: 'feature',
          type: 'object',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'Titel',
            },
            {
              name: 'key',
              type: 'string',
              title: 'Key in front-end',
              description:
                'LET OP: De front-end gebruikt deze key om te kijken of een feature aan of uit moet zijn. Wijzig deze dus niet zomaar!',
            },
            {
              name: 'description',
              type: 'text',
              title: 'Feature beschrijving',
              description:
                'Beschrijf waar de feature voor dient en waarom je deze feature aan of uit zou zetten',
            },
            {
              name: 'status',
              type: 'boolean',
              description:
                'Groen of bolletje rechts is aan, donker en bolletje links is uit',
              title: 'Feature staat aan of uit?',
            },
          ],
        },
      ],
    },
  ],
};
