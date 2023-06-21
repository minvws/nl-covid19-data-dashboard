export const lokalizeDocumentsWithoutDrafts = `//groq
  *[_type == 'lokalizeText' && !(_id in path("drafts.**"))]
`;
