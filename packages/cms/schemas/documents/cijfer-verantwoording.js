export default {
  name: "cijferVerantwoording",
  type: "document",
  title: "Cijferverantwoording",
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
    {
      name: "collapsibleList",
      type: "array",
      title: "Verantwoordingen",
      description:
        "Je kan verantwoordingen toevoegen, de volgorde veranderen, de teksten bijwerken of verwijderen",
      of: [{ type: "collapsible" }],
    },
  ],
  preview: {
    select: {
      title: "title.nl",
      subtitle: "description.nl",
    },
  },
};
