import { FCWithLayout } from '~/domain/layout/layout';
import { getMunicipalityLayout } from '~/domain/layout/municipality-layout';
import {
  getMunicipalityPaths,
  getMunicipalityStaticProps,
} from '~/static-props/municipality-data';

const Municipality: FCWithLayout<typeof getStaticProps> = () => {
  return null;
};

Municipality.getLayout = getMunicipalityLayout();

export const getStaticProps = getMunicipalityStaticProps();
export const getStaticPaths = getMunicipalityPaths();

export default Municipality;
