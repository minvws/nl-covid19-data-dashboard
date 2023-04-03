import { RiErrorWarningFill } from 'react-icons/ri';
import { StructureBuilder as S } from '@sanity/structure';

export const notFoundPageStructure = () => {
  return S.listItem()
    .id('notFoundPages')
    .title('404 Paginas')
    .icon(RiErrorWarningFill)
    .child(S.document().title('404 Paginas').schemaType('notFoundPagesCollection').documentId('notFoundPagesCollection'));
};
