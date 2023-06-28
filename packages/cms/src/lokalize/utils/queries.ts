export const lokalizeDocumentsWithoutDrafts = `*[_type == 'lokalizeText' && !(_id in path("drafts.**"))]`;
