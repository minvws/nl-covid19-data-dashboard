export function getInPositiveTestsQuery(locale: string) {
  return `
  *[_type=='in_positiveTestsPage']{
    "usefulLinks": [...pageLinks[]{
      "title": title.${locale},
      "href": href,
    }]
  }[0]
`;
}
