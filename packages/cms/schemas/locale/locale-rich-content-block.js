const supportedLanguages = [
  { id: 'nl', title: 'Nederlands', isDefault: true },
  { id: 'en', title: 'Engels' },
];

export default {
  name: 'localeRichContentBlock',
  type: 'object',
  title: 'Content',
  fields: supportedLanguages.map((lang) => ({
    title: lang.title,
    name: lang.id,
    type: 'array',
    of: [
      {
        type: 'block',

        // Only allow these block styles
        styles: [
          { title: 'Normal', value: 'normal' },
          { title: 'H2', value: 'h2' },
          { title: 'H3', value: 'h3' },
        ],
        lists: [],
        marks: {
          // Only allow these decorators
          decorators: [
            { title: 'Strong', value: 'strong' },
            { title: 'Emphasis', value: 'em' },
          ],
          annotations: [
            {
              name: 'link',
              type: 'object',
              title: 'External link',
              fields: [
                {
                  name: 'href',
                  type: 'url',
                  title: 'URL',
                },
              ],
            },
          ],
        },
      },
      {
        type: 'image',
        fields: [
          {
            title: 'Omschrijving',
            description: 'alt-tekst',
            name: 'description',
            type: 'string',
          },
        ],
      },
      // @TODO
      // {
      //   type: "lineChart"
      // }
    ],
  })),
};
