const REQUIRED = (x: any) => x.required();
const DATE_FORMAT = 'YYYY-MM-DD';

export const timelineEvent = {
  name: 'timelineEvent',
  type: 'object',
  title: 'Timeline Event',
  fields: [
    {
      title: 'Titel',
      name: 'title',
      type: 'localeString',
      validation: REQUIRED,
      options: {
        ignoreLanguageSwitcher: true,
      },
    },
    {
      title: 'Omschrijving',
      name: 'description',
      type: 'localeString',
      validation: REQUIRED,
      options: {
        ignoreLanguageSwitcher: true,
      },
    },
    {
      title: 'Datum',
      name: 'date',
      type: 'date',
      options: {
        dateFormat: DATE_FORMAT,
      },
      validation: REQUIRED,
    },
    {
      title: 'Einddatum',
      name: 'dateEnd',
      type: 'date',
      options: {
        dateFormat: DATE_FORMAT,
      },
    },
  ],
};
