import { FCWithLayout } from '~/domain/layout/layout';
import { getMunicipalityLayout } from '~/domain/layout/municipality-layout';
import {
  getMunicipalityStaticProps,
  getMunicipalityPaths,
  IMunicipalityData,
} from '~/static-props/municipality-data';

const Municipality: FCWithLayout<IMunicipalityData> = () => {
  return null;
};

Municipality.getLayout = getMunicipalityLayout();

export const getStaticProps = getMunicipalityStaticProps();
export const getStaticPaths = getMunicipalityPaths();

export default Municipality;
