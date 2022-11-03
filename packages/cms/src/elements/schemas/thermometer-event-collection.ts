import { FaTags } from 'react-icons/fa';
import type { Rule } from '~/sanity';

export const thermometerEventCollection = {
  name: 'thermometerEventCollection',
  type: 'document',
  title: 'Thermometer Event Collection',
  icon: FaTags,
  fields: [
    {
      title: 'Naam',
      name: 'name',
      type: 'string',
      validation: (x: Rule) => x.required(),
    },
    {
      title: 'Thermometer Events',
      name: 'thermometerEvents',
      type: 'array',
      of: [{ type: 'thermometerEvent' }],
      validation: (x: Rule) => x.required().min(1),
    },
  ],
};
