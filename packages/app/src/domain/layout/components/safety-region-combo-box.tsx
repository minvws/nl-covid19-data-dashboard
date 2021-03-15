import { ComboBox } from '~/components-styled/combo-box/combo-box';
import safetyRegions from '~/data/index';
import { useIntl } from '~/intl';

export function SafetyRegionComboBox({
  onSelect,
}: {
  onSelect: (vrcode: string) => void;
}) {
  const { siteText } = useIntl();

  return (
    <ComboBox
      placeholder={siteText.common.zoekveld_placeholder_regio}
      options={safetyRegions}
      onSelect={(region) => onSelect(region.code)}
    />
  );
}
