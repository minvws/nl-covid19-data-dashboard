const optionFields = [
  {
    title: 'Label',
    name: 'label',
    type: 'localeString',
    validation: (Rule: any) => Rule.reset().required(),
  },
  {
    title: 'Uitleg',
    name: 'description',
    description: 'Toelichting bij deze optie',
    type: 'localeText',
    validation: (Rule: any) =>
      Rule.fields({
        nl: (fieldRule: any) => fieldRule.reset().required(),
        en: (fieldRule: any) => fieldRule.reset().required(),
      }),
  },
];

export const optionTrue = {
  title: 'Optie Ja',
  name: 'optionTrue',
  type: 'object',
  fields: optionFields,
  preview: {
    select: {
      title: 'label.nl',
      subtitle: 'description.nl',
    },
  },
};

export const optionFalse = {
  title: 'Optie Nee',
  name: 'optionFalse',
  type: 'object',
  fields: optionFields,
  preview: {
    select: {
      title: 'label.nl',
      subtitle: 'description.nl',
    },
  },
};

export const binaryChoice = {
  title: 'Keuze uit twee teksten',
  name: 'binaryChoice',
  type: 'object',
  fields: [optionTrue, optionFalse],
};
