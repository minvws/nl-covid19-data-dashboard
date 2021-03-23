import { useRouter } from 'next/router';
import { ComboBox } from '~/components-styled/combo-box/combo-box';
import municipalities from '~/data/municipalSearchData';
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
      onSelect={({ gemcode }) => router.push(reverseRouter.vr.index(gemcode))}
    />
  );
}
