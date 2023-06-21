import { BsBookHalf, BsQuestionCircle } from 'react-icons/bs';
import { StructureBuilder } from 'sanity/desk';
import { addStructureItem } from '../utils';

export const faqStructureItem = (S: StructureBuilder) => {
  return S.listItem()
    .id('veelgestelde-vragen')
    .title('Veelgestelde vragen')
    .icon(BsQuestionCircle)
    .child(
      S.list()
        .title('Pagina, Groepen en Vragen')
        .items([
          addStructureItem(S, BsBookHalf, 'Pagina', 'veelgesteldeVragen'),
          ...S.documentTypeListItems().filter((item) => item.getId() === 'veelgesteldeVragenGroups'),
          ...S.documentTypeListItems().filter((item) => item.getId() === 'faqQuestion'),
        ])
    );
};
