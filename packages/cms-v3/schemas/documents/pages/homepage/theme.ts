import { BsFileEarmark } from 'react-icons/bs';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { IconInput } from '../../../../components/icon-input';
import { localeStringValidation } from '../../../../studio/validation/locale-validation';

export const theme = defineType({
  type: 'document',
  title: 'Thema',
  name: 'theme',
  icon: BsFileEarmark,
  fieldsets: [
    {
      title: 'Ondertitel',
      description: 'Klik op het label om de velden te tonen.',
      name: 'ondertitel',
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
    {
      title: 'Links',
      description: 'Klik op het label om de velden te tonen.',
      name: 'links',
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
  ],
  fields: [
    defineField({
      title: 'Titel',
      name: 'title',
      type: 'localeString',
      validation: localeStringValidation((rule) => rule.required()),
    }),
    defineField({
      title: 'Ondertitel',
      name: 'subTitle',
      type: 'localeRichContentBlock',
      fieldset: 'ondertitel',
    }),
    defineField({
      title: 'Thema icoon',
      name: 'themeIcon',
      type: 'string',
      validation: (rule) => rule.required(),
      components: {
        input: IconInput,
      },
    }),
    defineField({
      title: 'Tegels',
      name: 'tiles',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: { type: 'themeTile' } })],
    }),
    defineField({
      title: 'Label voor mobiel',
      name: 'labelMobile',
      type: 'localeString',
      fieldset: 'links',
    }),
    defineField({
      title: 'Label voor desktop',
      name: 'labelDesktop',
      type: 'localeString',
      fieldset: 'links',
    }),
    defineField({
      title: 'Links',
      name: 'links',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: { type: 'themeLink' } })],
      fieldset: 'links',
    }),
  ],
  preview: {
    select: {
      title: 'title.nl',
      subtitle: 'subTitle.nl',
    },
  },
});
