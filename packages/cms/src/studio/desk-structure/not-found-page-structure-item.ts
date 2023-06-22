import { BsFolderX } from 'react-icons/bs';
import { StructureBuilder } from 'sanity/desk';

export const notFoundPageStructureItem = (S: StructureBuilder) => {
  return S.listItem()
    .id('notFoundPages')
    .title("404 Pagina's")
    .icon(BsFolderX)
    .child(S.document().title("404 Pagina's").schemaType('notFoundPagesCollection').documentId('notFoundPagesCollection'));
};
