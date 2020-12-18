export default {
  title: "Collapsible",
  name: "collapsible",
  type: "object",
  fields: [
    { name: "title", type: "localeString", title: "Title" },
    { name: "description", type: "localeBlock", title: "Description" },
  ],
  preview: {
    select: {
      title: "title.nl",
      subtitle: "description.nl",
    },
  },
};
