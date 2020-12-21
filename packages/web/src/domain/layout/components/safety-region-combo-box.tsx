import { useRouter } from 'next/router';
import { ComboBox } from '~/components/comboBox';
import safetyRegions from '~/data/index';
import siteText from '~/locale/index';
import { useBreakpoints } from '~/utils/useBreakpoints';

export function SafetyRegionComboBox() {
  const router = useRouter();
  const breakpoints = useBreakpoints();

  return (
    <ComboBox
      placeholder={siteText.common.zoekveld_placeholder_regio}
      options={safetyRegions}
      onSelect={(region) =>
        router.push(
          breakpoints.md
            ? `/veiligheidsregio/${region.code}/positief-geteste-mensen`
            : `/veiligheidsregio/${region.code}?menu=1`
        )
      }
    />
  );
}
