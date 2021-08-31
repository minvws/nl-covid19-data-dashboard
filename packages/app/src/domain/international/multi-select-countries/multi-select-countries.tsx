import css, { SystemStyleObject } from '@styled-system/css';
import { ReactNode, useMemo, useState } from 'react';
import styled from 'styled-components';
import { colors } from '~/style/theme';
import { asResponsiveArray } from '~/style/utils';
import { assert } from '~/utils/assert';
import { CountryOption } from './context';
import { CountryCode } from './country-code';
import { MultiSelectCountrySearch } from './multi-select-country-search';
import { SelectedCountries } from './selected-countries';
import {
  ORDERED_COLORS,
  useMapCountryToColor,
} from './use-map-country-to-color';

interface MultiSelectCountriesProps {
  countryOptions: CountryOption[];
  children: (
    selectedCountries: CountryCode[],
    getColor: (countryCode: CountryCode) => string
  ) => ReactNode;
  limit?: number;
  alwaysSelectedCodes: CountryCode[];
  defaultSelectedCodes: CountryCode[];
}

export function MultiSelectCountries({
  countryOptions,
  children,
  limit,
  alwaysSelectedCodes,
  defaultSelectedCodes,
}: MultiSelectCountriesProps) {
  assert(
    limit ? limit <= ORDERED_COLORS.length : !limit,
    'limit cannot be higher than the # of specified colors'
  );

  const [selectedCountries, setSelectedCountries] = useState<CountryCode[]>(
    defaultSelectedCodes ?? []
  );

  const { getColor, toggleColor } = useMapCountryToColor(selectedCountries);

  function handleToggleCountry(countryData: CountryOption) {
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

    toggleColor(countryData.code);
  }

  const countries: CountryOption[] = useMemo(() => {
    return countryOptions
      .filter((x) => !alwaysSelectedCodes.includes(x.code))
      .map((countryOption) => ({
        ...countryOption,
        isSelected: selectedCountries.includes(countryOption.code),
      }));
  }, [countryOptions, selectedCountries, alwaysSelectedCodes]);

  const selectOptions = selectedCountries.map((countryCode) => ({
    metricProperty: countryCode,
    color: getColor(countryCode),
    label:
      countryOptions.find((x) => x.code === countryCode)?.name ?? countryCode,
    shape: 'line' as const,
  }));

  return (
    <>
      <List>
        <InputItem>
          <MultiSelectCountrySearch
            onToggleCountry={handleToggleCountry}
            countries={countries}
            limit={limit}
          />
        </InputItem>
        {alwaysSelectedCodes.map((countryCode) => (
          <AlwaysSelectedItem key={countryCode}>
            {countryOptions.find((x) => x.code === countryCode)?.name}
            <Line color={colors.data.neutral} />
          </AlwaysSelectedItem>
        ))}
        <SelectedCountries
          selectOptions={selectOptions}
          selection={selectedCountries}
          onRemoveItem={(countryCode) =>
            handleToggleCountry({ code: countryCode } as CountryOption)
          }
        />
      </List>
      {children(selectedCountries, getColor)}
    </>
  );
}

const List = styled.ul(
  css({
    listStyle: 'none',
    px: 0,
    m: 0,
    mt: 2,
    lineHeight: '2.25rem',
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
    fontSize: 1,
  })
);

const Line = styled.div<{ color: string }>(({ color }) =>
  css({
    display: 'block',
    position: 'absolute',
    borderTop: '3px solid',
    borderTopColor: color as SystemStyleObject,
    top: '15px',
    width: '15px',
    height: 0,
    borderRadius: '2px',
    left: 0,
  })
);
