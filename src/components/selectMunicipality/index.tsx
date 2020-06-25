import styles from './styles.module.scss';
import { SafetyRegion, MunicipalityMapping } from 'pages/regio';
import { useCombobox } from 'downshift';
import Arrow from 'assets/white-arrow.svg';

type SelectMunicipalityProps = {
  municipalities: MunicipalityMapping[];
  safetyRegions: SafetyRegion[];
  setSelectedSafetyRegion: any;
};

const SelectMunicipality: React.FC<SelectMunicipalityProps> = (props): any => {
  const { municipalities, safetyRegions, setSelectedSafetyRegion } = props;

  const itemToString = (item: MunicipalityMapping) => item.name;

  const onSelectedItemChange = ({ selectedItem }) => {
    setSelectedSafetyRegion(selectedItem?.safetyRegion);
  };

  const {
    getComboboxProps,
    getInputProps,
    getItemProps,
    getLabelProps,
    getMenuProps,
    getToggleButtonProps,
    highlightedIndex,
    inputValue,
    isOpen,
    openMenu,
  } = useCombobox({
    items: municipalities,
    itemToString,
    onSelectedItemChange,
  });

  const getItems = (safetyRegion: string) => {
    return municipalities
      .filter((el) => el.safetyRegion === safetyRegion)
      .sort((a, b) => a.name.toLowerCase() - b.name.toLowerCase());
  };

  const getDisabled = (item: MunicipalityMapping) => {
    if (!inputValue) return false;
    return !item.name.toLowerCase().startsWith(inputValue.toLowerCase());
  };

  const getRegionDisabled = (safetyRegion: string) => {
    return getItems(safetyRegion).every((item) => getDisabled(item));
  };

  return (
    <div className={styles.root}>
      <label className={styles.label} {...getLabelProps()}>
        Selecteer uw gemeente
      </label>
      <div className={styles.combobox} {...getComboboxProps()}>
        <input
          {...getInputProps()}
          onFocus={openMenu}
          placeholder="bv. Aa en Hunze"
        />
        <button
          {...getToggleButtonProps()}
          aria-label="open gemeentes keuzemenu"
        >
          <Arrow aria-hidden="true" />
        </button>
      </div>
      <div className={styles.menu} {...getMenuProps()}>
        {isOpen &&
          safetyRegions.map((safetyRegion) => {
            const items = getItems(safetyRegion.code);
            const isRegionDisabled = getRegionDisabled(safetyRegion.code);

            return (
              <div
                key={safetyRegion.code}
                className={`${
                  isRegionDisabled ? styles['region-disabled'] : ''
                }`}
              >
                <h4 className={styles.heading}>{safetyRegion.name}</h4>
                {items.map((municipality) => {
                  const isDisabled = getDisabled(municipality);
                  const isHighlighted =
                    highlightedIndex === municipalities.indexOf(municipality);

                  return (
                    <p
                      className={`${styles.item} ${
                        isHighlighted ? styles.active : ''
                      } ${isDisabled ? styles.disabled : ''}`}
                      key={municipality.name}
                      {...getItemProps({
                        disabled: isDisabled,
                        item: municipality,
                        index: municipalities.indexOf(municipality),
                      })}
                    >
                      {itemToString(municipality)}
                    </p>
                  );
                })}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default SelectMunicipality;
