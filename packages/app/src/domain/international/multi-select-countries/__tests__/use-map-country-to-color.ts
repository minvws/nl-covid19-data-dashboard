import { CountryCode } from '../country-code';
import {
  useMapCountryToColor,
  ORDERED_COLORS,
} from '../use-map-country-to-color';

import { act, renderHook } from '@testing-library/react-hooks';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

const UseMapCountryToColor = suite('useMapCountryToColor');

UseMapCountryToColor('should initialize in order', () => {
  const selectedCountries: CountryCode[] = ['nld', 'bel', 'deu'];

  const { result } = renderHook(() => useMapCountryToColor(selectedCountries));

  assert.equal(
    selectedCountries.map((code) => result.current.getColor(code)),
    ORDERED_COLORS.slice(0, selectedCountries.length)
  );
});

UseMapCountryToColor(
  'should return the same color for the same country after updates',
  () => {
    const selectedCountries: CountryCode[] = ['nld', 'bel', 'deu'];

    const { result } = renderHook(() =>
      useMapCountryToColor(selectedCountries)
    );

    const beforeChangeColor = result.current.getColor('bel');

    act(() => {
      result.current.toggleColor('nld');
    });

    assert.is(result.current.getColor('bel'), beforeChangeColor);
  }
);

UseMapCountryToColor.run();
