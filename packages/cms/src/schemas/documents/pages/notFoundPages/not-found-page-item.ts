import { REQUIRED } from '../../../../validation';

export const notFoundPageItem = {
  name: 'notFoundPageItem',
  title: '404 Pagina',
  type: 'document',
  fields: [
    {
      name: 'paginaType',
      title: 'Paginatype',
      description:
        'Select the page type. This determines the level (NL, GM, Artciles, General) for which you want this configuration to be used. Attention: This value for each 404 Page should be unique.',
      type: 'string',
      options: {
        list: [
          { value: 'general', title: 'Algemeen' },
          { value: 'nl', title: 'Landelijk' },
          { value: 'gm', title: 'Geemente' },
          { value: 'article', title: 'Artikelen' },
        ],
        layout: 'dropdown',
      },
      validation: REQUIRED,
    },
    {
      name: 'title',
      title: 'Titel',
      description: 'Configure the header that will be shown on the page.',
      type: 'localeRichContentBlock',
      validation: REQUIRED,
    },
    {
      name: 'description',
      title: 'Beschrijving',
      description: 'Configure a description. This text will be shown below the header.',
      type: 'localeRichContentBlock',
      validation: REQUIRED,
    },
    {
      name: 'links',
      title: 'Links',
      description: 'Configure a list of links. On the general page, this will be displayed below the descripton. On all other pages, this will be below the CTA.',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'notFoundPageLinks' } }],
    },
    {
      name: 'image',
      title: 'Image',
      description: 'Select an image to show on this page.',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          title: 'Alt Text',
          name: 'altText',
          type: 'localeString',
        },
      ],
      validation: REQUIRED,
    },
    {
      name: 'cta',
      title: 'Call To Action (CTA)',
      description: 'This CTA will be displayed as a button on the page',
      type: 'object',
      fields: [
        {
          title: 'CTA Label',
          name: 'ctaLabel',
          type: 'localeString',
        },
        {
          title: 'CTA Link',
          name: 'ctaLink',
          type: 'url',
        },
      ],
    },
  ],
};
