import { supportedLanguages } from '../../../language/supported-languages';

export default {
  name: 'downscalePage',
  type: 'document',
  title: 'Afschaling maatregelen',
  fieldsets: [
    {
      title: 'Begeleidende teksten bij wel/niet mogelijkheid tot afschalen',
      name: 'downscaleExplanation',
    },
  ],
  fields: [
    {
      name: 'page',
      type: 'titleDescriptionBlock',
      title: 'Pagina header',
    },
    {
      fieldset: 'downscaleExplanation',
      type: 'titleDescriptionBlock',
      title: ' ',
      name: 'downscaling',
    },
    {
      fieldset: 'downscaleExplanation',
      type: 'localeBlock',
      title: 'Uitleg voor wanneer afschaling mogelijk is',
      name: 'downscalingPossible',
    },
    {
      fieldset: 'downscaleExplanation',
      type: 'localeBlock',
      title: 'Uitleg voor wanneer afschaling niet mogelijk is',
      name: 'downscalingNotPossible',
    },
    {
      name: 'measures',
      title: 'Maatregelen toelichting',
      type: 'object',
      fields: [
        {
          name: 'title',
          type: 'localeString',
          title: 'Titel',
          validation: (Rule: any) =>
            Rule.fields({
              nl: (fieldRule: any) => fieldRule.reset().required(),
              en: (fieldRule: any) => fieldRule.reset().required(),
            }),
        },
        {
          name: 'description',
          type: 'object',
          title: 'Toelichting',
          fields: supportedLanguages.map((lang) => ({
            title: lang.title,
            name: lang.id,
            type: 'array',
            of: [
              {
                type: 'block',
              },
              {
                type: 'image',
                fields: [
                  {
                    name: 'alt',
                    title: 'Alternatieve tekst (toegankelijkheid)',
                    type: 'string',
                    validation: (Rule: any) => Rule.required(),
                    options: {
                      isHighlighted: true,
                    },
                  },
                  {
                    name: 'caption',
                    title: 'Onderschrift',
                    type: 'text',
                  },
                ],
              },
              {
                type: 'reference',
                to: { type: 'downscaleCollapsibleContent' },
                title: 'Inklapbaar blok',
              },
            ],
          })),
          validation: (Rule: any) =>
            Rule.fields({
              nl: (fieldRule: any) => fieldRule.reset().required(),
              en: (fieldRule: any) => fieldRule.reset().required(),
            }),
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'pageTitle.nl',
      subtitle: 'pageDescription.nl',
    },
  },
};
