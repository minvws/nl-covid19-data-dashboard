export default {
  name: "imagePipelineTest",
  type: "document",
  title: "Image pipeline test",
  fields: [
    {
      name: "title",
      type: "string",
      title: "Titel",
    },
    {
      name: "coverImage",
      type: "image",
      title: "Cover image",
    },
  ],
  preview: {
    select: {
      title: "title.nl",
      subtitle: "description.nl",
    },
  },
};
