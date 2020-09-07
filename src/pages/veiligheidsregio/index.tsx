import { FCWithLayout } from 'components/layout';
import { getSafetyRegionLayout } from 'components/layout/SafetyRegionLayout';

// Passing `any` to `FCWithLayout` because we
// can't do `getStaticProps` on this page because we require
// a code, but is is the screen we select a code (municipality).
// All other pages which use `getSafetyRegionLayout` can assume
// the data is always there. Making the data optional would mean
// lots of unnecessary null checks on those pages.
const SafetyRegion: FCWithLayout<any> = () => {
  return null;
};

SafetyRegion.getLayout = getSafetyRegionLayout();

export default SafetyRegion;
