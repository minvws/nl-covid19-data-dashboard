import { StructureBuilder } from 'sanity/desk';
import { BsThermometer } from 'react-icons/bs';

export const coronaThermometerStructureItem = (S: StructureBuilder) => {
  return S.listItem()
    .id('coronaThermometerPages')
    .title('Thermometer')
    .icon(BsThermometer)
    .child(S.document().title('Corona Thermometer').schemaType('coronaThermometer').documentId('coronaThermometer'));
};
