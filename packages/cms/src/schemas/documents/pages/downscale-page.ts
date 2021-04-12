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
      type: 'titleDescriptionBlock',
    },
  ],
  preview: {
    select: {
      title: 'pageTitle.nl',
      subtitle: 'pageDescription.nl',
    },
  },
};
