import { REQUIRED } from '../../validation';

export const advice = {
  type: 'object',
  title: 'Adviezen',
  name: 'advice',
  fields: [
    {
      name: 'title',
      title: 'Titel',
      description: 'Configureer een titel. Wordt bovenaan in de Adviezen sectie getoond.',
      type: 'localeString',
      validation: REQUIRED,
    },
    {
      name: 'description',
      title: 'Beschrijving',
      description: 'Configureer een beschrijving. Wordt onder de titel in de Adviezen sectie getoond.',
      type: 'localeRichContentBlock',
      validation: REQUIRED,
    },
    {
      name: 'links',
      title: 'Links',
      description: 'Configureer een lijst van een of meer links. Wordt onder de beschrijving getoond in de Adviezen sectie.',
      type: 'array',
      of: [{ type: 'link' }],
    },
    {
      name: 'image',
      title: 'Afbeelding',
      description: 'Configureer een afbeelding. Voorzie de afbeelding van een alt-tekst voor toegankelijkheidsdoeleinden.',
      type: 'image',
      validation: REQUIRED,
      fields: [
        {
          name: 'altText',
          title: 'Alt Text',
          description: 'De alt-tekst voor de afbeelding. Wordt voorgelezen door screen readers.',
          type: 'localeString',
          validation: REQUIRED,
        },
      ],
    },
  ],
};
