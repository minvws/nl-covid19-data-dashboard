import { CountryCode } from '../country-code';
import {
  useMapCountryToColor,
  ORDERED_COLORS,
} from '../use-map-country-to-color';

import { act, cleanup, renderHook } from '@testing-library/react-hooks';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

const UseMapCountryToColor = suite('useMapCountryToColor');

UseMapCountryToColor.after.each(() => {
  cleanup();
});

UseMapCountryToColor('should initialize in order', () => {
  const selectedCountries: CountryCode[] = ['nld', 'bel', 'deu'];

  const { result } = renderHook(() => useMapCountryToColor(selectedCountries));

  assert.equal(
    selectedCountries.map((code) => result.current.getColor(code)),
    ORDERED_COLORS.slice(0, selectedCountries.length)
  );
});

UseMapCountryToColor('should assign a unique color to a new country', () => {
  const selectedCountries: CountryCode[] = ['nld', 'bel', 'deu'];

  const { result } = renderHook(() => useMapCountryToColor(selectedCountries));

  act(() => {
    result.current.toggleColor('fra');
  });

  const uniqueAssignedColors = [
    ...new Set(
      (['nld', 'bel', 'deu', 'fra'] as CountryCode[]).map(
        result.current.getColor
      )
    ),
  ];

  assert.is(result.current.getColor('fra'), ORDERED_COLORS[3]);
  assert.is(['nld', 'bel', 'deu', 'fra'].length, uniqueAssignedColors.length);
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
