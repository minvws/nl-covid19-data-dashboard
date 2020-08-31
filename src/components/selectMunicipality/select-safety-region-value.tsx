import styles from './styles.module.scss';
import { SafetyRegion, MunicipalityMapping } from 'pages/regio';
import { UseComboboxGetItemPropsOptions } from 'downshift';
import { itemToString } from '.';

interface SelectSafetyRegionValueProps {
  safetyRegions: SafetyRegion[];
  inputValue: string;
  highlightedIndex: number;
  items: MunicipalityMapping[];
  getRegionItems: (
    safetyRegion: string,
    inputValue: string
  ) => MunicipalityMapping[];
  getRegionDisabled: (
    items: MunicipalityMapping[],
    inputValue: string
  ) => boolean;
  getItemProps: (
    options: UseComboboxGetItemPropsOptions<MunicipalityMapping>
  ) => any;
}

const SelectSafetyRegionValue = (props: SelectSafetyRegionValueProps): any => {
  const {
    safetyRegions,
    inputValue,
    items,
    getRegionItems,
    getRegionDisabled,
    getItemProps,
    highlightedIndex,
  } = props;
  return safetyRegions.map((safetyRegion: SafetyRegion) => {
    const regionItems = getRegionItems(safetyRegion.code, inputValue);
    const isRegionDisabled = getRegionDisabled(regionItems, inputValue);

    return (
      <div
        key={safetyRegion.code}
        className={`${isRegionDisabled ? styles['region-disabled'] : ''}`}
      >
        <h4 className={styles.heading}>{safetyRegion.name}</h4>
        {regionItems.map((municipality: MunicipalityMapping) => {
          const isHighlighted =
            highlightedIndex === items.indexOf(municipality);

          return (
            // disabled because key is passed through the Downshift prop getter
            // eslint-disable-next-line react/jsx-key
            <p
              {...getItemProps({
                key: municipality.name,
                item: municipality,
                index: items.indexOf(municipality),
                className: `${styles.item} ${
                  isHighlighted ? styles.active : ''
                }`,
              })}
            >
              {itemToString(municipality)}
            </p>
          );
        })}
      </div>
    );
  });
};

export default SelectSafetyRegionValue;
