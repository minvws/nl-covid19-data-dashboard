export const topicalPage = {
  title: 'Actueel pagina',
  name: 'topicalPage',
  type: 'document',
  fields: [
    {
      title: 'Laat weekbericht zien',
      name: 'showWeeklyHighlight',
      type: 'boolean',
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
      validation: (Rule: any) => [
        Rule.custom((value: any, context: any) => {
          if (context.document.showWeeklyHighlight) {
            return value.length === 2
              ? true
              : 'Als er een weekbericht geselecteerd is moeten er 2 uitgelichte items toegevoegd zijn.';
          } else {
            return value.length === 3
              ? true
              : 'Als er geen weekbericht geselecteerd is moeten er 3 uitgelichte items toegevoegd zijn.';
          }
        }).warning(),
        Rule.required().unique().min(2).max(3),
      ],
    },
  ],
};
