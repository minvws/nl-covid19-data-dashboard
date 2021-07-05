import { ReactNode, useMemo, useState } from 'react';
import { InteractiveLegend } from '~/components/interactive-legend';
import { colors } from '~/style/theme';
import { Country } from './context';
import { CountryCode } from './country-code';
import { SelectCountrySearch } from './select-country-search';

const unorderedColors = colors.data.multiseries;

const ORDERED_COLORS = [
  unorderedColors.cyan,
  unorderedColors.turquoise,
  unorderedColors.yellow,
  unorderedColors.orange,
  unorderedColors.magenta,
  unorderedColors.cyan_dark,
  unorderedColors.turquoise_dark,
  unorderedColors.yellow_dark,
  unorderedColors.orange_dark,
  unorderedColors.magenta_dark,
];

interface SelectCountriesProps {
  countriesAndLastValues: Country[];
  children: (selectedCountries: CountryCode[], colors: string[]) => ReactNode;
  limit?: number;
}

export function SelectCountries({
  countriesAndLastValues,
  children,
  limit,
}: SelectCountriesProps) {
  const [selectedCountries, setSelectedCountries] = useState<CountryCode[]>([]);

  function toggleCountry(countryData: any) {
    if (selectedCountries.includes(countryData.code)) {
      setSelectedCountries(
        selectedCountries.filter(
          (countryCode: CountryCode) => countryCode !== countryData.code
        )
      );
    } else {
      if (limit && selectedCountries.length >= limit) {
        return;
      }
      setSelectedCountries([...selectedCountries, countryData.code]);
    }
  }

  const countries: Country[] = useMemo(() => {
    return countriesAndLastValues.map((countryAndLastValue) => ({
      ...countryAndLastValue,
      isSelected: selectedCountries.includes(countryAndLastValue.code),
    }));
  }, [countriesAndLastValues, selectedCountries]);

  const selectOptions = selectedCountries.map((countryCode, index) => ({
    metricProperty: countryCode,
    color: ORDERED_COLORS[index],
    label:
      countriesAndLastValues.find((c) => c.code === countryCode)?.name ??
      countryCode,
    shape: 'line' as const,
  }));

  return (
    <>
      <SelectCountrySearch
        onSelectCountry={toggleCountry}
        countries={countries}
        limit={limit}
      />
      <InteractiveLegend
        selectOptions={selectOptions}
        selection={selectedCountries}
        onRemoveItem={(countryCode) => toggleCountry({ code: countryCode })}
        helpText={''}
      />
      {children(selectedCountries, ORDERED_COLORS)}
    </>
  );
}
