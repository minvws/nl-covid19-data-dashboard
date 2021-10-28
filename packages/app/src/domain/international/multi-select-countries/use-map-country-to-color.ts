import { colors } from '@corona-dashboard/common';
import { useCallback, useRef } from 'react';
import { CountryCode } from './country-code';

const {
  cyan,
  turquoise,
  yellow,
  orange,
  magenta,
  cyan_dark,
  turquoise_dark,
  yellow_dark,
  orange_dark,
  magenta_dark,
} = colors.data.multiseries;

export const ORDERED_COLORS = [
  cyan,
  turquoise,
  yellow,
  orange,
  magenta,
  cyan_dark,
  turquoise_dark,
  yellow_dark,
  orange_dark,
  magenta_dark,
];

/**
 * Persistently map country codes to colors.
 */
export function useMapCountryToColor(selectedCountries: CountryCode[]) {
  // Create an instance variable to track country-color mapping.
  const countryCodeToColor = useRef(
    new Map<CountryCode, string>(
      // Set the initial value
      selectedCountries.map((countryCode: CountryCode, index: number) => [
        countryCode,
        ORDERED_COLORS[index],
      ])
    )
  );

  const getColor = useCallback((countryCode: CountryCode) => {
    return countryCodeToColor.current.get(countryCode) as string;
  }, []);

  const toggleColor = useCallback((countryCode: CountryCode) => {
    if (countryCodeToColor.current.has(countryCode)) {
      countryCodeToColor.current.delete(countryCode);
    } else {
      const currentColors = [...countryCodeToColor.current.values()];
      // find the first unused color
      const color = ORDERED_COLORS.find(
        (color) => !currentColors.includes(color)
      );
      countryCodeToColor.current.set(countryCode, color as string);
    }
  }, []);

  return { getColor, toggleColor };
}
