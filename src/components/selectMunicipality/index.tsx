import styles from './styles.module.scss';

import { useCombobox } from 'downshift';
import { useState } from 'react';

import { SafetyRegion, MunicipalityMapping } from 'pages/regio';
import Arrow from 'assets/white-arrow.svg';
import ResetIcon from 'assets/reset.svg';

import ScreenReaderOnly from 'components/screenReaderOnly';

import * as piwik from '../../lib/piwik';

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

  // Select the current content of the input
  const selectInputContent = () => {
    // The DOM is used here instead of a ref because Downshift overwrites any ref
    // used on the input element.
    const input: HTMLInputElement = document.querySelector(
      '#select-municipality-input'
    );

    input && input.select();
  };

  // Set the safety region code to the URL on item selection
  const onSelectedItemChange = ({ selectedItem }) => {
    setSelectedSafetyRegion(selectedItem?.safetyRegion);

    piwik.event({
      category: 'select_regio',
      action: selectedItem.name,
    });
  };

  // Filters municipalities when the input changes
  const onInputValueChange = ({ inputValue }) => {
    setItems(municipalities.filter((item) => !getDisabled(item, inputValue)));
  };

  // Select the current input when the dropdown is opened.
  const onIsOpenChange = ({ isOpen }) => {
    if (isOpen) {
      selectInputContent();
    }
  };

  // Select the input content and open the menu on focusing the input
  const onFocus = () => {
    selectInputContent();
    openMenu();
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

  // State reducer with an override for the ItemClick action.
  const stateReducer = (state, actionAndChanges) => {
    const { type, changes } = actionAndChanges;
    switch (type) {
      // overriding the result of this action fixes a race condition bug in IE11
      // where several actions would be triggered after selecting an item in the
      // dropdown menu.
      case useCombobox.stateChangeTypes.ItemClick: {
        return changes;
      }
      default: {
        // Returning changes here, and not state, allows Downshift to handle
        // actions that are not overridden itself.
        return changes;
      }
    }
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
  } = useCombobox({
    items,
    itemToString,
    stateReducer,
    onSelectedItemChange,
    onInputValueChange,
    onIsOpenChange,
    getA11yStatusMessage,
    getA11ySelectionMessage,
  });

  return (
    <div className={styles.root}>
      <label {...getLabelProps({ className: styles.label })}>
        Selecteer uw gemeente
      </label>
      <div {...getComboboxProps({ className: styles.combobox })}>
        <input
          {...getInputProps({
            onClick: onFocus,
            id: 'select-municipality-input',
            placeholder: 'bv. Aa en Hunze',
          })}
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
          {...getToggleButtonProps({
            tabIndex: 0,
            className: styles.open,
            'aria-label': 'open gemeentes',
          })}
        >
          <Arrow aria-hidden="true" />
        </button>
      </div>
      <div
        {...getMenuProps({
          className: styles.menu,
        })}
      >
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
          })}
      </div>
    </div>
  );
};

export default SelectMunicipality;
