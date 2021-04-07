import { binaryChoice } from '../../objects/binary-choice';

export default {
  name: 'afschalingPage',
  type: 'document',
  title: 'Afschaling maatregelen',
  fieldsets: [
    { title: 'Pagina header', name: 'header' },
    { title: 'Afschalingsuitleg', name: 'downScaleExplanation' },
    { title: 'Maatregelen toelichting', name: 'measuresDescription' },
  ],
  fields: [
    {
      fieldset: 'header',
      name: 'pageTitle',
      type: 'localeString',
      title: 'Titel',
    },
    {
      fieldset: 'header',
      name: 'pageDescription',
      type: 'localeBlock',
      title: 'Beschrijving',
    },
    {
      fieldset: 'downScaleExplanation',
      name: 'explanationTitle',
      type: 'localeString',
      title: 'Titel',
    },
    {
      fieldset: 'downScaleExplanation',
      ...binaryChoice,
      title: 'Uitleg wel/niet mogelijkheid tot afschalen',
    },
    {
      fieldset: 'downScaleExplanation',
      name: 'explanationDescription',
      type: 'localeBlock',
      title: 'Beschrijving',
    },
    {
      fieldset: 'measuresDescription',
      name: 'measuresTitle',
      type: 'localeString',
      title: 'Titel',
    },
    {
      fieldset: 'measuresDescription',
      name: 'measuresDescription',
      type: 'localeBlock',
      title: 'Beschrijving',
    },
  ],
  preview: {
    select: {
      title: 'title.nl',
      subtitle: 'description.nl',
    },
  },
};
