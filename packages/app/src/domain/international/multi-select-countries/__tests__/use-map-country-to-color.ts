/**
 * @jest-environment jsdom
 */

import { CountryCode } from '../country-code';
import {
  useMapCountryToColor,
  ORDERED_COLORS,
} from '../use-map-country-to-color';
import { renderHook } from '@testing-library/react-hooks';

describe('useMapCountryToColor()', () => {
  const selectedCountries: CountryCode[] = ['nld', 'bel', 'deu'];
  const { result } = renderHook(() => useMapCountryToColor(selectedCountries));

  it('should initialize in order', () => {
    expect(
      selectedCountries.map((code) => result.current.getColor(code))
    ).toStrictEqual(ORDERED_COLORS.slice(0, selectedCountries.length));
  });

  it('should return the same color for the same country after changes', () => {
    const beforeChangeColor = result.current.getColor('bel');
    result.current.toggleColor('nld');
    expect(result.current.getColor('bel')).toBe(beforeChangeColor);
  });
});
