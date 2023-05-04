import { StructureBuilder } from 'sanity/desk';
import { GrCircleInformation } from 'react-icons/gr';
import { addListItem } from './utils';

export default (S: StructureBuilder) =>
  S.list()
    .id('content')
    .title('Content')
    .items([addListItem(S, GrCircleInformation, 'Over dit dashboard', 'overDitDashboard')]);
