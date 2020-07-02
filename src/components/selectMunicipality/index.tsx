import styles from './styles.module.scss';

import { useCombobox } from 'downshift';
import { useState } from 'react';

import { SafetyRegion, MunicipalityMapping } from 'pages/regio';
import Arrow from 'assets/white-arrow.svg';
import ResetIcon from 'assets/reset.svg';
import ScreenReaderOnly from 'components/screenReaderOnly';

type SelectMunicipalityProps = {
  municipalities: MunicipalityMapping[];
  safetyRegions: SafetyRegion[];
  setSelectedSafetyRegion: (code: SafetyRegion['code']) => void;
};

const SelectMunicipality: React.FC<SelectMunicipalityProps> = (props): any => {
  const { municipalities, safetyRegions, setSelectedSafetyRegion } = props;

  // Set the full list of municipalities as the initial state.
  const [items, setItems] = useState(() => municipalities);

  // Returns the string to display as an item's label.
  const itemToString = (item?: MunicipalityMapping) => (item ? item.name : '');

  // Returns municipalities by safety region and current inputValue, sorted alphabetically.
  const getRegionItems = (safetyRegion: string, inputValue) => {
    return items
      .filter((el) => el.safetyRegion === safetyRegion)
      .filter((el) => !getDisabled(el, inputValue))
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  // Returns true if a municipality should be disabled based on the current input value.
  const getDisabled = (item: MunicipalityMapping, inputValue) => {
    if (!inputValue) return false;
    return !item.name.toLowerCase().startsWith(inputValue.toLowerCase());
  };

  // Returns true if a safety region should be hidden.
  const getRegionDisabled = (items: MunicipalityMapping[], inputValue) => {
    return items.every((item) => getDisabled(item, inputValue));
  };

  // Set the safety region code to the URL on item selection
  const onSelectedItemChange = ({ selectedItem }) => {
    setSelectedSafetyRegion(selectedItem?.safetyRegion);
  };

  // Filters municipalities when the input changes
  const onInputValueChange = ({ inputValue }) => {
    setItems(municipalities.filter((item) => !getDisabled(item, inputValue)));
  };

  // Clear the input when the dropdown is opened.
  const onIsOpenChange = ({ isOpen }) => {
    if (isOpen) selectItem(null);
  };

  // Returns a string for an aria-live selection status message.
  const getA11ySelectionMessage = ({ itemToString, selectedItem }) => {
    if (selectedItem) {
      const safetyRegion = safetyRegions.find(
        (el) => el.code === selectedItem.safetyRegion
      );

      return `Gemeente ${itemToString(selectedItem)} in veiligheidsregio ${
        safetyRegion.name
      } is geselecteerd.`;
    }

    return 'Er is geen gemeente geselecteerd';
  };

  // Returns a string for an aria-live status message shown while typing.
  const getA11yStatusMessage = ({ resultCount }) => {
    return `Er zijn ${resultCount} resultaten, gebruik de omhoog en omlaag pijltjes toetsen om te navigeren. Druk op Enter om te selecteren.`;
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
    reset,
    selectedItem,
    selectItem,
  } = useCombobox({
    items,
    itemToString,
    onSelectedItemChange,
    onInputValueChange,
    onIsOpenChange,
    getA11yStatusMessage,
    getA11ySelectionMessage,
  });

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
        {selectedItem && (
          <button onClick={reset} className={styles.reset}>
            <ScreenReaderOnly>Reset</ScreenReaderOnly>
            <div aria-hidden="true">
              <ResetIcon />
            </div>
          </button>
        )}
        <button
          {...getToggleButtonProps()}
          tabIndex={0}
          className={styles.open}
          aria-label="open gemeentes keuzemenu"
        >
          <Arrow aria-hidden="true" />
        </button>
      </div>
      <div className={styles.menu} {...getMenuProps()}>
        {isOpen &&
          safetyRegions.map((safetyRegion) => {
            const regionItems = getRegionItems(safetyRegion.code, inputValue);
            const isRegionDisabled = getRegionDisabled(regionItems, inputValue);

            return (
              <div
                key={safetyRegion.code}
                className={`${
                  isRegionDisabled ? styles['region-disabled'] : ''
                }`}
              >
                <h4 className={styles.heading}>{safetyRegion.name}</h4>
                {regionItems.map((municipality) => {
                  const isHighlighted =
                    highlightedIndex === items.indexOf(municipality);

                  return (
                    <p
                      className={`${styles.item} ${
                        isHighlighted ? styles.active : ''
                      }`}
                      key={municipality.name}
                      {...getItemProps({
                        item: municipality,
                        index: items.indexOf(municipality),
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
