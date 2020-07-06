import { useState } from 'react';
import { useCombobox } from 'downshift';
import Arrow from 'assets/white-arrow.svg';
import regioData from 'data';

import classNames from './selectRegio.module.scss';

const getInitialState = () => {
  const items = [...regioData];
  items.shift();

  // sort alphabetically
  items.sort((a, b) => {
    let nameA = a.name.toUpperCase(); // ignore upper and lowercase
    let nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });
  return items;
};

const itemToString = (item) => item?.name ?? '';

const SelectRegio = ({ selected, setSelection }) => {
  const [inputItems, setInputItems] = useState(() => getInitialState());

  const stateReducer = (state, actionAndChanges) => {
    const { type, changes } = actionAndChanges;

    switch (type) {
      case useCombobox.stateChangeTypes.InputBlur: {
        // Don't reset the value on blur, only close the dropdown menu
        // This fixes a bug in Edge < 18, where the blur event would cause
        // Downshift to reset its state.
        return { ...state, isOpen: false };
      }
      default: {
        return changes;
      }
    }
  };

  const {
    isOpen,
    openMenu,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    stateReducer,
    items: inputItems,
    itemToString,
    initialSelectedItem: selected,
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        setSelection(selectedItem);
      }
    },
    onInputValueChange: ({ inputValue }) => {
      setInputItems(
        getInitialState().filter((item) => {
          const source = itemToString(item).toLowerCase().trim();
          const searchValue = inputValue.toLowerCase().trim();

          const isMatch = source.includes(searchValue);
          return isMatch;
        })
      );
    },
    onIsOpenChange: () => {
      setInputItems(getInitialState());
    },
  });

  const openOnFocus = () => openMenu();

  return (
    <div className={classNames.selectRegio}>
      <label {...getLabelProps()}>Veiligheidsregio</label>
      <div {...getComboboxProps()} className={classNames.container}>
        <input
          {...getInputProps({
            onFocus: openOnFocus,
            placeholder: 'Selecteer uw veiligheidsregio',
          })}
        />
        <button {...getToggleButtonProps()} aria-label="open menu">
          <Arrow />
        </button>
      </div>
      <ul {...getMenuProps()}>
        {isOpen &&
          inputItems.map((item, index) => (
            // eslint-disable-next-line react/jsx-key
            <li
              style={
                highlightedIndex === index ? { backgroundColor: '#bde4ff' } : {}
              }
              {...getItemProps({
                item,
                index,
                key: item.code,
              })}
            >
              {itemToString(item)}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default SelectRegio;
