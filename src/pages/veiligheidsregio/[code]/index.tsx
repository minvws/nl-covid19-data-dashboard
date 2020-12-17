import { FCWithLayout } from '~/components/layout';
import { getSafetyRegionLayout } from '~/components/layout/SafetyRegionLayout';
import {
  getSafetyRegionStaticProps,
  getSafetyRegionPaths,
  ISafetyRegionData,
} from '~/static-props/safetyregion-data';

const SafetyRegion: FCWithLayout<ISafetyRegionData> = () => {
  return null;
};

SafetyRegion.getLayout = getSafetyRegionLayout();

export const getStaticProps = getSafetyRegionStaticProps;
export const getStaticPaths = getSafetyRegionPaths();

export default SafetyRegion;
