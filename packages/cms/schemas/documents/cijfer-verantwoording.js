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
      name: "slug",
      type: "slug",
      readOnly: true,
      description:
        "We use the slug for preview routes and have hardcoded these to match the front-end. To change this, ask a developer to help you.",
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
};
