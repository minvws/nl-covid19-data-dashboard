import { FCWithLayout } from '~/domain/layout/layout';
import { getMunicipalityLayout } from '~/domain/layout/municipality-layout';
import { getGmData, getLastGeneratedDate } from '~/static-props/data';
import { getPaths } from '~/static-props/gm-data';
import { createGetStaticProps } from '~/static-props/utils/create-get-static-props';

export const getStaticPaths = getPaths();

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getGmData
);

const Municipality: FCWithLayout<typeof getStaticProps> = () => null;
Municipality.getLayout = getMunicipalityLayout();

export default Municipality;
