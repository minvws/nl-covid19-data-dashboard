export default {
  name: "veelgesteldeVragen",
  type: "document",
  title: "Veelgestelde vragen",
  __experimental_actions: ["update", /* 'create', 'delete', */ "publish"],
  fields: [
    {
      name: "title",
      type: "localeString",
      title: "Title",
    },
    {
      name: "description",
      type: "localeBlock",
      title: "Description",
    },
    // {
    //   title: "Open graph",
    //   name: "openGraph",
    //   description: "Metadata",
    //   type: "openGraph",
    // },
    {
      name: "content",
      type: "array",
      title: "Vragen",
      description:
        "Je kan vragen toevoegen, de volgorde veranderen, de tekst bijwerken of verwijderen",
      of: [{ type: "collapsible" }],
    },
  ],
};
