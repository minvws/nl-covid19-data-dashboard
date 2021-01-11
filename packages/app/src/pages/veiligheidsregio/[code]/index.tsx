import { FCWithLayout } from '~/domain/layout/layout';
import { getSafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import {
  getSafetyRegionPaths,
  getSafetyRegionStaticProps,
} from '~/static-props/safetyregion-data';

const SafetyRegion: FCWithLayout<typeof getStaticProps> = () => {
  return null;
};

SafetyRegion.getLayout = getSafetyRegionLayout();

export const getStaticProps = getSafetyRegionStaticProps();
export const getStaticPaths = getSafetyRegionPaths();

export default SafetyRegion;
