import { defineField, defineType } from 'sanity';

export const SHARED_TREND_ICON_FIELDS = [
  defineField({
    title: 'Kleur',
    name: 'color',
    type: 'string',
    options: {
      list: [
        { value: 'RED', title: 'Rood' },
        { value: 'GREEN', title: 'Groen' },
      ],
      layout: 'dropdown',
    },
    validation: (rule) => rule.required(),
  }),
  defineField({
    title: 'Richting',
    name: 'direction',
    type: 'string',
    options: {
      list: [
        { value: 'UP', title: 'Omhoog' },
        { value: 'DOWN', title: 'Omlaag' },
      ],
      layout: 'dropdown',
    },
    validation: (rule) => rule.required(),
  }),
];

export const trendIcon = defineType({
  name: 'trendIcon',
  type: 'document',
  title: 'Trend icon',
  fields: [
    ...SHARED_TREND_ICON_FIELDS,
    defineField({
      title: 'Intensiteit',
      name: 'intensity',
      description: 'Beschrijft de intensiteit van relatieve verandering ten opzichte van de vorige meeting.',
      type: 'number',
      options: {
        list: [
          { value: 1, title: '1 pijltje gekleurd' },
          { value: 2, title: '2 pijltjes gekleurd' },
          { value: 3, title: '3 pijltjes gekleurd' },
        ],
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),
  ],
});
