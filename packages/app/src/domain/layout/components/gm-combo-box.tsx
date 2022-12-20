import { gmData } from '@corona-dashboard/common';
import { useRouter } from 'next/router';
import { ComboBox } from '~/components/combo-box/combo-box';
import { useIntl } from '~/intl';
import { useReverseRouter } from '~/utils/use-reverse-router';

interface GmComboBoxProps {
  getLink?: (gmcode: string) => string;
  selectedGmCode: string;
}

export function GmComboBox(props: GmComboBoxProps) {
  const { getLink, selectedGmCode } = props;

  const { commonTexts } = useIntl();
  const reverseRouter = useReverseRouter();
  const router = useRouter();

  return (
    <ComboBox
      placeholder={commonTexts.common.zoekveld_placeholder_gemeente}
      options={gmData}
      onSelect={({ gemcode }) => {
        router.push(typeof getLink === 'function' ? getLink(gemcode) : reverseRouter.gm.index(gemcode));
      }}
      selectedOption={gmData.find((gm) => gm.gemcode === selectedGmCode)}
    />
  );
}
