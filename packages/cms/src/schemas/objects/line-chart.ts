/**
 * This object is used to render line charts within content blocks.
 * 
 * @ToDo: More fields / configuration for this is needed.
 */

export default {
  title: "Lijngrafiek",
  name: "lineChart",
  type: "object",
  fields: [
    {
      title: "Metrieknaam (code)",
      name: "metricName",
      type: "string"
    },
    {
      title: "Metriekwaarde (code)",
      name: "metricProperty",
      type: "string"
    }
  ],
  preview: {
    select: {
      title: "title"
    },
  },
};
