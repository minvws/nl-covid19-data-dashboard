import { TITLE_DESCRIPTION_FIELDS } from '../fields/title-description-fields';

export default {
  title: 'Inklapbare titel en inhoud',
  name: 'collapsible',
  type: 'object',
  fields: TITLE_DESCRIPTION_FIELDS,
  preview: {
    select: {
      title: 'title.nl',
      subtitle: 'content.nl',
    },
  },
};
