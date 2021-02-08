import { ComboBox } from '~/components-styled/combo-box/combo-box';
import municipalities from '~/data/municipalSearchData';
import siteText from '~/locale/index';

export function MunicipalityComboBox({
  onSelect,
}: {
  onSelect: (gmcode: string) => void;
}) {
  return (
    <ComboBox
      placeholder={siteText.common.zoekveld_placeholder_gemeente}
      options={municipalities}
      onSelect={({ gemcode }) => onSelect(gemcode)}
    />
  );
}
