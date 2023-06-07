export const getItemQuery = (slug: string | string[] | undefined) => `//groq
  *[_type == 'cijferVerantwoordingItem' && slug.current == '${slug}'][0]
`;

export const getPageQuery = (locale: string) => `//groq
  *[_type == 'cijferVerantwoording']{
    "title": title.${locale},
    "collapsibleList": [...collapsibleList[]->
      {
        "group": group->group.${locale},
        "groupIcon": group->icon,
        "title": title.${locale},
        "slug": slug.current,
    }]
  }[0]
`;
