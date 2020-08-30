import styles from './styles.module.scss';
import { MunicipalityMapping } from 'pages/regio';
import { UseComboboxGetItemPropsOptions } from 'downshift';
import { itemToString } from '.';

interface SelectMunicipalityValueProps {
  getMunicipalities: (inputValue: string) => MunicipalityMapping[];
  inputValue: string;
  highlightedIndex: number;
  items: MunicipalityMapping[];
  getItemProps: (
    options: UseComboboxGetItemPropsOptions<MunicipalityMapping>
  ) => any;
}

const SelectMunicipalityValue = (props: SelectMunicipalityValueProps): any => {
  const {
    getMunicipalities,
    inputValue,
    highlightedIndex,
    items,
    getItemProps,
  } = props;

  return getMunicipalities(inputValue).map(
    (municipality: MunicipalityMapping) => {
      const isHighlighted = highlightedIndex === items.indexOf(municipality);
      return (
        // eslint-disable-next-line react/jsx-key
        <p
          {...getItemProps({
            key: municipality.name,
            item: municipality,
            index: items.indexOf(municipality),
            className: `${styles.item} ${isHighlighted ? styles.active : ''}`,
          })}
        >
          {itemToString(municipality)}
        </p>
      );
    }
  );
};

export default SelectMunicipalityValue;
