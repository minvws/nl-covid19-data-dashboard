export default {
  widgets: [
    {
      name: 'document-list',
      options: {
        title: 'Documents with unpublished changes',
        query: '*[_id in path("drafts.**")] | order(_updatedAt desc)',
      },
    },
  ],
};
