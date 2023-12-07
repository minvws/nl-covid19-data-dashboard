import { addStructureItem } from '../utils';
import { BsCardList, BsCardText, BsGear, BsHouse } from 'react-icons/bs';
import { StructureBuilder } from 'sanity/desk';

export const homepageStructureItem = (S: StructureBuilder) => {
  return S.listItem()
    .id('topicalPage')
    .title('Samenvattingspagina')
    .icon(BsHouse)
    .child(
      S.list()
        .title('Pagina configuratie')
        .items([
          addStructureItem(S, BsGear, 'Samenvattingspagina configuratie', 'topicalPageConfig'),
          addStructureItem(S, BsCardList, 'Weeksamenvatting', 'weeklySummary'),
          addStructureItem(S, BsCardText, "KPI thema's en tegels", 'themeCollection'),
          addStructureItem(S, BsCardText, 'Adviezen', 'advice'),
        ])
    );
};
