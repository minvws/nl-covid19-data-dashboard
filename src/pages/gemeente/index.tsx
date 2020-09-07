import { FCWithLayout } from 'components/layout';
import { getMunicipalityLayout } from 'components/layout/MunicipalityLayout';
import MunicipalityMap, {
  TMunicipalityPoint,
} from 'components/mapChart/MunicipalityMap';
import { useRouter } from 'next/router';

const Municipality: FCWithLayout = () => {
  const router = useRouter();

  const onSelectMunicpal = (context: TMunicipalityPoint) => {
    router.push(`/gemeente/${context.gmcode}/positief-geteste-mensen`);
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
