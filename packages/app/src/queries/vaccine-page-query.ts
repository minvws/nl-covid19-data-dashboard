export function getVaccinePageQuery(locale: string) {
  return `
  *[_type=='vaccinationsPage']{
    "pageDescription": pageDescription.${locale},
    "pageLinks": [...usefulLinks[]{
      "title": title.${locale},
      "category": category.${locale},
      "href": href,
      "cover": {
        ...cover,
        "asset": cover.asset->
      }
    }]
  }[0]
`;
}
