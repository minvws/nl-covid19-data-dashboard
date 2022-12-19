import { vrData } from '@corona-dashboard/common';
import { useRouter } from 'next/router';
import { ComboBox } from '~/components/combo-box/combo-box';
import { useIntl } from '~/intl';
import { useReverseRouter } from '~/utils/use-reverse-router';

interface VrComboBoxProps {
  getLink?: (code: string) => string;
  selectedVrCode: string;
}

export function VrComboBox(props: VrComboBoxProps) {
  const { getLink, selectedVrCode } = props;

  const { commonTexts } = useIntl();
  const reverseRouter = useReverseRouter();
  const router = useRouter();

  return (
    <ComboBox
      placeholder={commonTexts.common.zoekveld_placeholder_regio}
      options={vrData}
      onSelect={(region) => router.push(typeof getLink === 'function' ? getLink(region.code) : reverseRouter.vr.index(region.code))}
      selectedOption={vrData.find((vr) => vr.code === selectedVrCode)}
    />
  );
}
