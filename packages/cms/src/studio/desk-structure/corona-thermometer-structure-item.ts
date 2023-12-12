import { BsThermometer } from 'react-icons/bs';
import { StructureBuilder } from 'sanity/desk';

export const coronaThermometerStructureItem = (S: StructureBuilder) => {
  return S.listItem()
    .id('coronaThermometerPage')
    .title('Thermometer')
    .icon(BsThermometer)
    .child(S.document().title('Corona Thermometer').schemaType('coronaThermometer').documentId('coronaThermometer'));
};
