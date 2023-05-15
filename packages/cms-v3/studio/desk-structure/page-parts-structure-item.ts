import { BsPuzzle } from 'react-icons/bs';
import { StructureBuilder } from 'sanity/desk';

export const pagePartsStructureItem = (S: StructureBuilder) => {
  return S.listItem()
    .id('pagina-onderdelen')
    .title('Pagina onderdelen')
    .icon(BsPuzzle)
    .child(
      S.list()
        .title("Pagina's en onderdelen")
        .items([
          ...S.documentTypeListItems().filter((item) => item.getId() === 'pageIdentifier'),
          // S.divider(),
          // ...S.documentTypeListItems().filter((item) => ['pageArticles', 'pageLinks', 'pageHighlightedItems', 'pageRichText'].includes(item.getId() ?? '')),
        ])
    );
};
