import { ComboBox } from '~/components-styled/combo-box/combo-box';
import municipalities from '~/data/municipalSearchData';
import { useIntl } from '~/intl';

export function MunicipalityComboBox({
  onSelect,
}: {
  onSelect: (gmcode: string) => void;
}) {
  const { siteText } = useIntl();

  return (
    <ComboBox
      placeholder={siteText.common.zoekveld_placeholder_gemeente}
      options={municipalities}
      onSelect={({ gemcode }) => onSelect(gemcode)}
    />
  );
}
