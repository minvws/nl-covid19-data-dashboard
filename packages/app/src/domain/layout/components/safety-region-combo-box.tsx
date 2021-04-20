import { useRouter } from 'next/router';
import { ComboBox } from '~/components/combo-box/combo-box';
import { vrData } from '~/data/vr';
import { useIntl } from '~/intl';
import { useReverseRouter } from '~/utils/use-reverse-router';

export function SafetyRegionComboBox() {
  const { siteText } = useIntl();
  const reverseRouter = useReverseRouter();
  const router = useRouter();

  return (
    <ComboBox
      placeholder={siteText.common.zoekveld_placeholder_regio}
      options={vrData}
      onSelect={(region) => router.push(reverseRouter.vr.index(region.code))}
    />
  );
}
