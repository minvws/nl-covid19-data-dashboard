import * as React from 'react';
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
  const [inputItems, setInputItems] = React.useState(() => getInitialState());

  React.useEffect(() => {
    selectItem(selected);
  }, [selected]);

  const {
    isOpen,
    selectItem,
    openMenu,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
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
  let ieFix = {};
  if (!isOpen) {
    ieFix = { overflowY: 'hidden' };
  }
  return (
    <div className={classNames.selectRegio}>
      <label {...getLabelProps()}>Veiligheidsregio</label>
      <div {...getComboboxProps()} className={classNames.container}>
        <input
          onFocus={openOnFocus}
          {...getInputProps()}
          placeholder="Selecteer uw veiligheidsregio"
        />
        <button {...getToggleButtonProps()} aria-label="open menu">
          <Arrow />
        </button>
      </div>
      <ul {...getMenuProps()} style={ieFix}>
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
