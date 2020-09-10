import { FCWithLayout } from 'components/layout';
import { getSafetyRegionLayout } from 'components/layout/SafetyRegionLayout';
import SafetyRegionMap from 'components/vx/SafetyRegionMap';
import { useRouter } from 'next/router';

// Passing `any` to `FCWithLayout` because we
// can't do `getStaticProps` on this page because we require
// a code, but is is the screen we select a code (municipality).
// All other pages which use `getSafetyRegionLayout` can assume
// the data is always there. Making the data optional would mean
// lots of unnecessary null checks on those pages.
const SafetyRegion: FCWithLayout<any> = () => {
  const router = useRouter();

  const onSelectRegion = (context: any) => {
    router.push(
      '/veiligheidsregio/[code]/positief-geteste-mensen',
      `/veiligheidsregio/${context.vrcode}/positief-geteste-mensen`
    );
  };

  return (
    <article className="metric-article">
      <SafetyRegionMap
        style={{ height: '800px' }}
        onSelect={onSelectRegion}
        gradient={['#9DDEFE', '#0290D6']}
      />
    </article>
  );
};

SafetyRegion.getLayout = getSafetyRegionLayout();

export default SafetyRegion;
