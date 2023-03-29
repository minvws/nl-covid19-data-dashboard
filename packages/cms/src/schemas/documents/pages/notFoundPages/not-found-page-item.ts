import { KpiIconInput } from '../../../../components/portable-text/kpi-configuration/kpi-icon-input';
import { REQUIRED } from '../../../../validation';

export const notFoundPageItem = {
  name: 'notFoundPageItem',
  title: '404 Pagina',
  type: 'document',
  fields: [
    {
      name: 'pageType',
      title: 'Pagina Type',
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
      type: 'localeString',
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
      description: 'Configure a list of links. On the general page, this will be displayed below the description. On all other pages, this will be below the CTA.',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'notFoundPageLinks' } }],
    },
    {
      name: 'image',
      title: 'Image',
      description: 'Select an image to show on this page. If selected, and alt text must be provided for accessibility.',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'altText',
          title: 'Alt Text',
          description: 'This text will be used by screen readers for accessibility.',
          type: 'localeString',
          validation: REQUIRED,
        },
      ],
      validation: REQUIRED,
    },
    {
      name: 'cta',
      title: 'Call To Action (CTA)',
      description: 'This CTA will be displayed as a button on the page.',
      type: 'object',
      fields: [
        {
          name: 'ctaLabel',
          title: 'CTA Label',
          description: 'If a CTA is configured, then a label must be provided.',
          type: 'localeString',
          validation: REQUIRED,
        },
        {
          name: 'ctaLink',
          title: 'CTA Link',
          description: "If a CTA is configured, then a URL for the CTA's destination must be provided",
          type: 'url',
          validation: REQUIRED,
        },
        {
          name: 'ctaIcon',
          title: 'CTA Icon',
          description: 'If a CTA is configured, you can choose to show an icon to the left of the CTA label',
          type: 'string',
          inputComponent: KpiIconInput,
        },
      ],
    },
  ],
};
