export function getVaccinePageQuery() {
  //@TODO We need to switch this from process.env to context as soon as we use i18n routing
  // const { locale } = context;
  const locale = process.env.NEXT_PUBLIC_LOCALE;

  return `
  *[_type=='vaccinationsPage']{
    "pageInfo": {
      "title": pageInfo.title.${locale},
      "description": pageInfo.description.${locale},
    },
    "pageLinks": [...pageLinks[]{
      "title": title.${locale},
      "category": category.${locale},
      "href": href,
      "cover": {
        ...cover,
        "asset": cover.asset->
      }
    }],
    "linksTitle": linksTitle.${locale},
    "title": title.${locale},
    "description": description.${locale},
    "milestones": [...milestones | order(date)[] {
      "title": title.${locale},
      date,
    }],
    "expectedMilestones": [...expected[]{
      "item": ${locale}
    }] 
  }[0]
`;
}
