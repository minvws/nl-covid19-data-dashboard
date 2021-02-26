import { targetLanguage } from '~/locale';

export const vaccinePageQuery = `
  *[_type=='vaccinationsPage']{
    "title": title.${targetLanguage},
    "description": description.${targetLanguage},
    "miles": [...milestones | order(date)[] {
      "title": title.${targetLanguage},
      date,
    }],
    "expected": [...expected[]{
      "item": ${targetLanguage}
    }] 
  }[0]
`;
