import { useRouter } from 'next/router';
import { ComboBox } from '~/components/combo-box/combo-box';
import municipalities from '~/data/municipal-search-data';
import { useIntl } from '~/intl';
import { useReverseRouter } from '~/utils/use-reverse-router';

export function MunicipalityComboBox() {
  const { siteText } = useIntl();
  const reverseRouter = useReverseRouter();
  const router = useRouter();

  return (
    <ComboBox
      placeholder={siteText.common.zoekveld_placeholder_gemeente}
      options={municipalities}
      onSelect={({ gemcode }) => router.push(reverseRouter.gm.index(gemcode))}
    />
  );
}
