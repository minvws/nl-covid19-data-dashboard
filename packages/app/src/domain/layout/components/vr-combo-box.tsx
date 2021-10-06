import { vrData } from '@corona-dashboard/common';
import { useRouter } from 'next/router';
import { ComboBox } from '~/components/combo-box/combo-box';
import { useIntl } from '~/intl';
import { useReverseRouter } from '~/utils/use-reverse-router';

export function VrComboBox() {
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
