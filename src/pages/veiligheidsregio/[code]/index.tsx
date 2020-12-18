import { FCWithLayout } from '~/domain/layout/layout';
import { getSafetyRegionLayout } from '~/domain/layout/SafetyRegionLayout';
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
