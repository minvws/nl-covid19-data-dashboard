import { FCWithLayout } from 'components/layout';
import { getMunicipalityLayout } from 'components/layout/MunicipalityLayout';
import MunicipalityMap, {
  TMunicipalityPoint,
} from 'components/mapChart/MunicipalityMap';
import { useRouter } from 'next/router';

// Passing `any` to `FCWithLayout` because we
// can't do `getStaticProps` on this page because we require
// a code, but is is the screen we select a code (municipality).
// All other pages which use `getMunicipalityLayout` can assume
// the data is always there. Making the data optional would mean
// lots of unnecessary null checks on those pages.
const Municipality: FCWithLayout<any> = () => {
  const router = useRouter();

  const onSelectMunicpal = (context: TMunicipalityPoint) => {
    router.push(
      '/gemeente/[code]/positief-geteste-mensen',
      `/gemeente/${context.gemcode}/positief-geteste-mensen`
    );
  };

  return (
    <MunicipalityMap
      onSelect={onSelectMunicpal}
      gradient={['#9DDEFE', '#0290D6']}
    />
  );
};

Municipality.getLayout = getMunicipalityLayout();

export default Municipality;
