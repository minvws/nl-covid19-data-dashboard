import css, { SystemStyleObject } from '@styled-system/css';
import { ReactNode, useMemo, useState } from 'react';
import styled from 'styled-components';
import { colors } from '~/style/theme';
import { asResponsiveArray } from '~/style/utils';
import { Country } from './context';
import { CountryCode } from './country-code';
import { SelectCountrySearch } from './select-country-search';
import { SelectedCountries } from './selected-countries';

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
  alwaysSelected: CountryCode[];
}

export function SelectCountries({
  countriesAndLastValues,
  children,
  limit,
  alwaysSelected,
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
    return countriesAndLastValues
      .filter((c) => !alwaysSelected.includes(c.code))
      .map((countryAndLastValue) => ({
        ...countryAndLastValue,
        isSelected: selectedCountries.includes(countryAndLastValue.code),
      }));
  }, [countriesAndLastValues, selectedCountries, alwaysSelected]);

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
      <List>
        <InputItem>
          <SelectCountrySearch
            onSelectCountry={toggleCountry}
            countries={countries}
            limit={limit}
          />
        </InputItem>
        {alwaysSelected.map((countryCode) => (
          <AlwaysSelectedItem key={countryCode}>
            {countriesAndLastValues.find((c) => c.code === countryCode)?.name}
            <Line color={colors.data.neutral} />
          </AlwaysSelectedItem>
        ))}
        <SelectedCountries
          selectOptions={selectOptions}
          selection={selectedCountries}
          onRemoveItem={(countryCode) => toggleCountry({ code: countryCode })}
        />
      </List>
      {children(selectedCountries, ORDERED_COLORS)}
    </>
  );
}

const List = styled.ul(
  css({
    listStyle: 'none',
    px: 0,
    m: 0,
    mt: 2,
  })
);

const InputItem = styled.li(
  css({
    mb: 2,
    mr: asResponsiveArray({ _: 2, md: 3 }),
    position: 'relative',
    display: 'inline-block',
    height: '1.5rem',
    width: '300px',
    verticalAlign: 'top',
  })
);

const AlwaysSelectedItem = styled.li(
  css({
    mb: 2,
    mr: asResponsiveArray({ _: 2, md: 3 }),
    position: 'relative',
    display: 'inline-block',
    pl: '25px', // alignment with shape
  })
);

const Line = styled.div<{ color: string }>(({ color }) =>
  css({
    display: 'block',
    position: 'absolute',
    borderTop: '3px solid',
    borderTopColor: color as SystemStyleObject,
    top: '10px',
    width: '15px',
    height: 0,
    borderRadius: '2px',
    left: 0,
  })
);
