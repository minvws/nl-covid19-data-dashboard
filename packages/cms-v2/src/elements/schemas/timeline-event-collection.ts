import { FaTags } from 'react-icons/fa';
import type { Rule } from '~/sanity';

export const timelineEventCollection = {
  name: 'timelineEventCollection',
  type: 'document',
  title: 'Timeline Event Collection',
  icon: FaTags,
  fields: [
    {
      title: 'Naam',
      name: 'name',
      type: 'string',
      validation: (x: Rule) => x.required(),
    },
    {
      title: 'Timeline Events',
      name: 'timelineEvents',
      type: 'array',
      of: [{ type: 'timelineEvent' }],
      validation: (x: Rule) => x.required().min(1),
    },
  ],
};
