import { BsFileEarmark } from 'react-icons/bs';
import { defineField, defineType } from 'sanity';
import { IconInput } from '../../../../components/icon-input';
import { supportedLanguages } from '../../../../studio/i18n';
import { localeStringValidation, localeValidation } from '../../../../studio/validation/locale-validation';
import { ThemeTileDate } from '../../../../components/topical-theme-tile-date/theme-tile-date';

export const themeTile = defineType({
  type: 'document',
  title: 'Thema tegel',
  name: 'themeTile',
  icon: BsFileEarmark,
  fieldsets: [
    {
      title: 'KPI Waarde',
      name: 'kpiValue',
    },
    {
      title: 'Thema tegeldatum-configuratie',
      name: 'theme-tile-date-config',
      description: 'Klik op het label om de velden te tonen.',
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
    {
      title: 'Link configuratie',
      name: 'link-configuration',
      description: 'Klik op het label om de velden te tonen.',
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
      title: 'Tegel icoon',
      name: 'tileIcon',
      type: 'string',
      validation: (rule) => rule.required(),
      components: {
        input: IconInput,
      },
    }),
    defineField({
      title: 'Omschrijving',
      name: 'description',
      type: 'localeRichContentBlock',
      validation: localeValidation((rule) => rule.required()),
    }),
    defineField({
      title: 'KPI waarde',
      name: 'kpiValue',
      type: 'localeString',
      fieldset: 'kpiValue',
    }),
    defineField({
      title: 'Toon geen pijlen',
      name: 'hideTrendIcon',
      type: 'boolean',
      description: 'Wanneer aangevinkt, wordt het trend icoon niet getoond bij de KPI waarde.',
      fieldset: 'kpiValue',
      initialValue: false,
    }),
    defineField({
      title: 'Metadata label',
      description: 'Bij {{date}} wordt de tekst geplaatst van het tegeldatumveld. Deze kan handmatig overschreven worden.',
      name: 'sourceLabel',
      type: 'localeString',
    }),
    defineField({
      title: 'Tegeldatum',
      description: 'Deze velden krijgen hun input van de tegeldatum-configuratie. Om de configuratie te resetten kunnen deze velden leeg gemaakt worden.',
      name: 'tileDate',
      type: 'object',
      fields: supportedLanguages.map(({ title, id }) =>
        defineField({
          title,
          name: id,
          type: 'string',
          description: 'Het resultaat van de tegeldatum-configuratie is:',
          components: {
            input: ThemeTileDate,
          },
        })
      ),
    }),
    defineField({
      title: 'Configuratie velden',
      description: 'Voor de start- en einddatum van deze tegel op de samenvattingspagina.',
      name: 'themeTileDateConfig',
      type: 'themeTileDateConfig',
      fieldset: 'theme-tile-date-config',
    }),
    defineField({
      title: 'Trend pijlen',
      name: 'trendIcon',
      type: 'trendIcon',
    }),
    defineField({
      title: 'Link',
      description: 'Vul hier de link in naar de juiste Landelijk pagina',
      name: 'cta',
      type: 'link',
      fieldset: 'link-configuration',
    }),
  ],
  preview: {
    select: {
      title: 'title.nl',
      subtitle: 'description.nl',
    },
  },
});
