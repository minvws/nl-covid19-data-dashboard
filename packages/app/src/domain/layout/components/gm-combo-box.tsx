import { useRouter } from 'next/router';
import { ComboBox } from '~/components/combo-box/combo-box';
import { gmData } from '~/data/gm';
import { useIntl } from '~/intl';
import { useReverseRouter } from '~/utils/use-reverse-router';

export function GmComboBox() {
  const { siteText } = useIntl();
  const reverseRouter = useReverseRouter();
  const router = useRouter();

  return (
    <ComboBox
      placeholder={siteText.common.zoekveld_placeholder_gemeente}
      options={gmData}
      onSelect={({ gemcode }) => router.push(reverseRouter.gm.index(gemcode))}
    />
  );
}
