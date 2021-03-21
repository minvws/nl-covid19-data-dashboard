import { useRouter } from 'next/router';
import { ComboBox } from '~/components-styled/combo-box/combo-box';
import municipalities from '~/data/municipalSearchData';
import siteText from '~/locale/index';
import { reverseRouter } from '~/utils/reverse-router';

export function MunicipalityComboBox() {
  const router = useRouter();

  return (
    <ComboBox
      placeholder={siteText.common.zoekveld_placeholder_gemeente}
      options={municipalities}
      onSelect={({ gemcode }) => router.push(reverseRouter.vr.index(gemcode))}
    />
  );
}
