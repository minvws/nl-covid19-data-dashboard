import { TITLE_DESCRIPTION_FIELDS } from '../fields/title-description-fields';

export default {
  title: 'Titel en toelichting blok',
  name: 'titleDescriptionBlock',
  type: 'object',
  fields: [
    TITLE_DESCRIPTION_FIELDS[0],
    {
      ...TITLE_DESCRIPTION_FIELDS[1],
      title: 'Toelichting',
    },
  ],
  preview: {
    select: {
      title: 'title.nl',
      subtitle: 'content.nl',
    },
  },
};
