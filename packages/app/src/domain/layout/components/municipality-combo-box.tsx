import { useRouter } from 'next/router';
import { ComboBox } from '~/components/comboBox';
import municipalities from '~/data/municipalSearchData';
import siteText from '~/locale/index';
import { useBreakpoints } from '~/utils/useBreakpoints';

export function MunicipalityComboBox() {
  const router = useRouter();
  const breakpoints = useBreakpoints();

  return (
    <ComboBox
      placeholder={siteText.common.zoekveld_placeholder_gemeente}
      options={municipalities}
      onSelect={(region) =>
        router.push(
          breakpoints.md
            ? `/gemeente/${region.gemcode}/positief-geteste-mensen`
            : `/gemeente/${region.gemcode}?menu=1`
        )
      }
    />
  );
}
