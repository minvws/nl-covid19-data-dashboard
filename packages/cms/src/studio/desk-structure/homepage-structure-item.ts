import { BsCardList, BsCardText, BsGear, BsHouse, BsThermometer } from 'react-icons/bs';
import { StructureBuilder } from 'sanity/desk';
import { addStructureItem } from '../utils';

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
          addStructureItem(S, BsThermometer, 'Thermometer', 'thermometer'),
          addStructureItem(S, BsCardText, "KPI thema's en tegels", 'themeCollection'),
          addStructureItem(S, BsCardText, 'Adviezen', 'advice'),
        ])
    );
};
