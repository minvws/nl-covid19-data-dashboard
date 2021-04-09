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
      validation: (Rule: any) =>
        Rule.fields({
          nl: (fieldRule: any) => fieldRule.reset().required(),
          en: (fieldRule: any) => fieldRule.reset().required(),
        }),
    },
    {
      fieldset: 'downscaleExplanation',
      type: 'localeBlock',
      title: 'Uitleg voor wanneer afschaling niet mogelijk is',
      name: 'downscalingNotPossible',
      validation: (Rule: any) =>
        Rule.fields({
          nl: (fieldRule: any) => fieldRule.reset().required(),
          en: (fieldRule: any) => fieldRule.reset().required(),
        }),
    },
    {
      name: 'measures',
      type: 'titleDescriptionBlock',
      title: 'Maatregelen toelichting',
    },
    {
      name: 'faqs',
      title: 'Veelgestelde vragen',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'downscaleFaq' } }],
      validation: (Rule: any) => Rule.reset().unique(),
    },
  ],
  preview: {
    select: {
      title: 'pageTitle.nl',
      subtitle: 'pageDescription.nl',
    },
  },
};
