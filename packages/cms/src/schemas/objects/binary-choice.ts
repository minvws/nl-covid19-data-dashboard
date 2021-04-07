export const binaryChoiceOption = {
  title: 'Optie',
  name: 'binaryChoiceOption',
  type: 'object',
  fields: [
    {
      title: 'Wel/niet',
      name: 'binaryOption',
      type: 'boolean',
    },
    {
      title: 'Uitleg',
      name: 'choiceDescription',
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
      title: 'choiceDescription.nl',
      binaryOption: 'binaryOption',
    },
    prepare: (selection: any) => {
      console.dir(selection);
      return {
        title: selection.binaryOption ? 'Keuze: Wel' : 'Keuze: Niet',
        subtitle: selection.choiceDescription,
      };
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
