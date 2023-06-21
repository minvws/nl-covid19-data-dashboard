import { BsNewspaper } from 'react-icons/bs';
import { StructureBuilder } from 'sanity/desk';

export const articlesStructureItem = (S: StructureBuilder) => {
  return S.listItem().id('articles').title('Artikelen').icon(BsNewspaper).child(S.documentTypeList('article'));
};
