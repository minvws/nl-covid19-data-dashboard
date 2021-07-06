export const topicalPage = {
  title: 'Actueel pagina',
  name: 'topicalPage',
  type: 'document',
  fields: [
    {
      title: 'Laat weekbericht zien',
      name: 'flag',
      type: 'boolean',
      initialValue: false,
    },
    {
      title: 'Uitgelichte items',
      name: 'highlights',
      type: 'array',
      of: [
        {
          type: 'object',
          preview: {
            select: {
              title: 'title.nl',
            },
          },
          fields: [
            {
              title: 'Titel',
              name: 'title',
              type: 'localeString',
              validation: (Rule: any) =>
                Rule.fields({
                  nl: (fieldRule: any) => fieldRule.reset().required(),
                  en: (fieldRule: any) => fieldRule.reset().required(),
                }),
            },
            {
              title: 'Categorie',
              name: 'category',
              type: 'localeString',
              validation: (Rule: any) =>
                Rule.fields({
                  nl: (fieldRule: any) => fieldRule.reset().required(),
                  en: (fieldRule: any) => fieldRule.reset().required(),
                }),
            },
            {
              name: 'label',
              type: 'localeString',
              title: 'Tekst in de link',
              validation: (Rule: any) =>
                Rule.fields({
                  nl: (fieldRule: any) => fieldRule.reset().required(),
                  en: (fieldRule: any) => fieldRule.reset().required(),
                }),
            },
            {
              name: 'href',
              type: 'string',
              title: 'Link naar pagina',
              validation: (Rule: any) => Rule.required(),
            },
            {
              title: 'Afbeelding',
              name: 'cover',
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                {
                  title: 'Alternatieve tekst (toegankelijkheid)',
                  name: 'alt',
                  type: 'localeString',
                },
              ],
              validation: (Rule: any) => Rule.required(),
            },
          ],
        },
      ],
      validation: (Rule: any) => Rule.required().unique().min(2).max(3),
    },
  ],
};
