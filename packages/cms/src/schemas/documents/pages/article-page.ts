export const page = {
  title: 'Page',
  name: 'articlePage',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Page slug',
      description: 'How can we identify this route by page slug?',
      type: 'slug',
    },
  ],
};
