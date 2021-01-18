import { FCWithLayout } from '~/domain/layout/layout';
import { getMunicipalityLayout } from '~/domain/layout/municipality-layout';
import { getGmData, getLastGeneratedDate } from '~/static-props/get-data';
import { createGetStaticProps } from '~/static-props/create-get-static-props';

export { getStaticPaths } from '~/static-paths/gm';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getGmData
);

const Municipality: FCWithLayout<typeof getStaticProps> = () => null;
Municipality.getLayout = getMunicipalityLayout();

export default Municipality;
