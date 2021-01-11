export default {
  name: "overDitDashboard",
  type: "document",
  title: "Over dit dashboard",
  __experimental_actions: ["update", /* 'create', 'delete', */ "publish"],
  fields: [
    {
      name: "title",
      type: "localeString",
      title: "Titel",
    },
    {
      name: "description",
      type: "localeBlock",
      title: "Beschrijving",
    },
  ],
  preview: {
    select: {
      title: "title.nl",
      subtitle: "description.nl",
    },
  },
};
