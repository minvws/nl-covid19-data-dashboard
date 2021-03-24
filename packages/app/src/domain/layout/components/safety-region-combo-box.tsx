import { useRouter } from 'next/router';
import { ComboBox } from '~/components-styled/combo-box/combo-box';
import safetyRegions from '~/data/index';
import { useIntl } from '~/intl';
import { useReverseRouter } from '~/utils/use-reverse-router';

export function SafetyRegionComboBox() {
  const { siteText } = useIntl();
  const reverseRouter = useReverseRouter();
  const router = useRouter();

  return (
    <ComboBox
      placeholder={siteText.common.zoekveld_placeholder_regio}
      options={safetyRegions}
      onSelect={(region) => router.push(reverseRouter.vr.index(region.code))}
    />
  );
}
