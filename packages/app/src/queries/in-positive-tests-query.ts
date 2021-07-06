export function getInPositiveTestsQuery() {
  const locale = process.env.NEXT_PUBLIC_LOCALE;

  return `
  *[_type=='in_positiveTestsPage']{
    "usefulLinks": [...pageLinks[]{
      "title": title.${locale},
      "href": href,
    }]
  }[0]
`;
}
