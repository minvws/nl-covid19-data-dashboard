import { FCWithLayout } from 'components/layout';
import { getNationalLayout } from 'components/layout/NationalLayout';

import getNlData, { INationalData } from 'static-props/nl-data';

const National: FCWithLayout<INationalData> = () => {
  return null;
};

National.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default National;
