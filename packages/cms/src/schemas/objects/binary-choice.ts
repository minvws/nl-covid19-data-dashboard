export const binaryChoiceOption = {
  title: 'Optie',
  name: 'binaryChoiceOption',
  type: 'object',
  fields: [
    {
      title: 'Wel/niet',
      name: 'binaryOption',
      type: 'boolean',
      validation: (Rule: any) => Rule.reset().required(),
    },
    {
      title: 'Label',
      name: 'binaryOptionLabel',
      type: 'localeString',
      validation: (Rule: any) => Rule.reset().required(),
    },
    {
      title: 'Uitleg',
      name: 'binaryOptionDescription',
      description: 'Toelichting bij deze optie',
      type: 'localeText',
      validation: (Rule: any) =>
        Rule.fields({
          nl: (fieldRule: any) => fieldRule.reset().required(),
          en: (fieldRule: any) => fieldRule.reset().required(),
        }),
    },
  ],
  preview: {
    select: {
      title: 'binaryOptionLabel.nl',
      subtitle: 'binaryOptionDescription.nl',
    },
  },
};
export const binaryChoice = {
  title: 'Keuze uit twee teksten',
  name: 'binaryChoice',
  type: 'array',
  of: [{ type: 'binaryChoiceOption' }],
  validation: (Rule: any) =>
    Rule.reset()
      .required()
      .max(2)
      .min(2)
      .custom((props: any[]) => {
        if (props.length < 2) {
          return true;
        } else if (props[0].binaryOption === props[1].binaryOption) {
          return 'De lijst moet bestaan uit een Wel en een Niet waarde';
        }
        return true;
      }),
};
