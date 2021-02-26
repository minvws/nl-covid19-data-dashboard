export default {
  title: 'Inklapbare titel en inhoud',
  name: 'milestone',
  type: 'object',
  fields: [
    {
      title: 'Datum',
      name: 'date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      validation: (Rule: any) => Rule.required(),
    },
    { name: 'title', type: 'localeString', title: 'Titel' },
  ],
  preview: {
    select: {
      title: 'title.nl',
      date: 'date'
    },
    prepare(selection: any) {
      const {title, date} = selection
      return {
        title: title,
        subtitle: date
      }
    }
  }
};
