import { Bs123, BsBookHalf } from 'react-icons/bs';
import { StructureBuilder } from 'sanity/desk';
import { addStructureItem } from '../utils';

export const dataExplainedStructureItem = (S: StructureBuilder) => {
  return S.listItem()
    .id('cijferverantwoording')
    .title('Cijferverantwoording')
    .icon(Bs123)
    .child(
      S.list()
        .title('Pagina, Groepen en Verantwoordingen')
        .items([
          addStructureItem(S, BsBookHalf, 'Pagina', 'cijferVerantwoording'),
          ...S.documentTypeListItems().filter((item) => item.getId() === 'cijferVerantwoordingGroups'),
          ...S.documentTypeListItems().filter((item) => item.getId() === 'cijferVerantwoordingItem'),
        ])
    );
};
