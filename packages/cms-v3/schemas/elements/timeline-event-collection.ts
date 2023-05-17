import { BsTags } from 'react-icons/bs';
import { defineArrayMember, defineField, defineType } from 'sanity';

export const timelineEventCollection = defineType({
  name: 'timelineEventCollection',
  type: 'document',
  title: 'Timeline Event Collection',
  icon: BsTags,
  fields: [
    defineField({
      title: 'Naam',
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: 'Timeline Events',
      name: 'timelineEvents',
      type: 'array',
      of: [defineArrayMember({ type: 'timelineEvent' })],
      validation: (rule) => rule.required().min(1),
    }),
  ],
});
