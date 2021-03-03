export default {
  widgets: [
    {
      name: 'document-list',
      options: {
        title: 'Documents with unpublished changes',
        query: '*[_id in path("drafts.**")] | order(_updatedAt desc)',
      },
      layout: {
        width: 'small',
        height: 'small',
      },
    },
    {
      name: 'document-list',
      options: {
        title: 'Last edited articles',
        order: '_updatedAt desc',
        types: ['article'],
      },
      layout: {
        width: 'small',
        height: 'small',
      },
    },
    {
      name: 'document-list',
      options: {
        title: 'Last edited editorials',
        order: '_updatedAt desc',
        types: ['editorial'],
      },
      layout: {
        width: 'small',
        height: 'small',
      },
    },
  ],
};
