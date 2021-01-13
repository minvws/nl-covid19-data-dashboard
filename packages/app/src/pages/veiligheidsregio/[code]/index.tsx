import { FCWithLayout } from '~/domain/layout/layout';
import { getSafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import { getVrData, getLastGeneratedDate } from '~/static-props/data';
import { createGetStaticProps } from '~/static-props/utils/create-get-static-props';
import { getPaths } from '~/static-props/vr-data';

export const getStaticPaths = getPaths();

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getVrData
);

const SafetyRegion: FCWithLayout<typeof getStaticProps> = () => null;
SafetyRegion.getLayout = getSafetyRegionLayout();

export default SafetyRegion;
