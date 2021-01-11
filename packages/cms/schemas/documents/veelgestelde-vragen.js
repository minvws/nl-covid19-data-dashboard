export default {
  name: "veelgesteldeVragen",
  type: "document",
  title: "Veelgestelde vragen",
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
      name: "questions",
      type: "array",
      title: "Vragen",
      description:
        "Je kan veel gestelde vragen toevoegen, de volgorde veranderen, de tekst bijwerken of verwijderen",
      of: [{ type: "collapsible" }],
    },
  ],
};
