import { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { Country } from './context';
import { CountryCode } from './country-code';
import { SelectCountrySearch } from './select-country-search';

interface SelectCountriesProps {
  countriesAndLastValues: Country[];
  children: (selectedCountries: CountryCode[]) => ReactNode;
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

  return (
    <>
      <SelectCountrySearch
        onSelectCountry={toggleCountry}
        countries={countries}
      />
      {children(selectedCountries)}
    </>
  );
}
