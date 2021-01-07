export default {
  name: "siteSettings",
  type: "document",
  title: "Site Settings",
  __experimental_actions: ["update", /* 'create', 'delete', */ "publish"],
  fields: [
    {
      name: "title",
      type: "string",
      title: "Titel van de website",
    },
    {
      title: "SEO Instellingen",
      name: "openGraph",
      description:
        "Dit zijn de standaard SEO instellingen voor het CoronaDashboard.",
      type: "openGraph",
    },
  ],
};
