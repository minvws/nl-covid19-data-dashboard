import { localeStringValidation, localeValidation } from '../../../language/locale-validation';

export const overRisiconiveaus = {
  name: 'overRisicoNiveaus',
  type: 'document',
  title: 'Over risiconiveaus',
  fields: [
    {
      name: 'title',
      type: 'localeString',
      title: 'Titel',
      validation: localeStringValidation((rule) => rule.required()),
    },
    {
      name: 'description',
      type: 'localeBlock',
      title: 'Beschrijving',
      validation: localeValidation((rule) => rule.required()),
    },
    {
      name: 'scoreBoardTitle',
      type: 'localeString',
      title: 'Scoreboard titel',
      validation: localeStringValidation((rule) => rule.required()),
    },
    {
      name: 'scoreBoardDescription',
      type: 'localeText',
      title: 'Scoreboard beschrijving',
      validation: localeValidation((rule) => rule.required()),
    },
    {
      name: 'riskLevelExplanations',
      type: 'localeRichContentBlock',
      title: 'Verdere uitleg',
      validation: localeValidation((rule) => rule.required()),
    },
    {
      name: 'collapsibleList',
      type: 'array',
      title: 'Uitklapbare informatie',
      description: 'Je kan uitklapbare informatie toevoegen, de volgorde veranderen, de teksten bijwerken of verwijderen',
      of: [{ type: 'collapsible' }],
    },
  ],
  preview: {
    select: {
      title: 'title.nl',
      subtitle: 'description.nl',
    },
  },
};
