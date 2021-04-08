import { binaryChoice } from '../../objects/binary-choice';

export default {
  name: 'afschalingPage',
  type: 'document',
  title: 'Afschaling maatregelen',
  fieldsets: [{ title: 'Afschalingsuitleg', name: 'downscaleExplanation' }],
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
      ...binaryChoice,
      name: 'downscalePossible',
      title: 'Uitleg wel/niet mogelijkheid tot afschalen',
    },
    {
      name: 'measures',
      type: 'titleDescriptionBlock',
      title: 'Maatregelen toelichting',
    },
  ],
  preview: {
    select: {
      title: 'pageTitle.nl',
      subtitle: 'pageDescription.nl',
    },
  },
};
