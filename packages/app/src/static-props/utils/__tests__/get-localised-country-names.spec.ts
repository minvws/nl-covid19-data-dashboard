import { getLocalisedCountryNames } from '../get-localised-country-names';

describe('StaticProps::Util: getLocalisedCountryNames', () => {
  let currentLocale = 'nl';

  beforeEach(() => {
    currentLocale = process.env.NEXT_PUBLIC_LOCALE ?? 'nl';
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_LOCALE = currentLocale;
  });

  it('Should return the Dutch country names', () => {
    const values = [
      {
        iso_code: 'nld',
        value: 1,
      },
      {
        iso_code: 'nor',
        value: 2,
      },
      {
        iso_code: 'afg',
        value: 3,
      },
    ];
    const result = getLocalisedCountryNames(values, 'iso_code');

    expect(result).toEqual({
      nld: 'Nederland',
      nor: 'Noorwegen',
      afg: 'Afghanistan',
    });
  });

  it('Should return the English country names', () => {
    process.env.NEXT_PUBLIC_LOCALE = 'en';
    const values = [
      {
        iso_code: 'nld',
        value: 1,
      },
      {
        iso_code: 'nor',
        value: 2,
      },
      {
        iso_code: 'afg',
        value: 3,
      },
    ];
    const result = getLocalisedCountryNames(values, 'iso_code');

    expect(result).toEqual({
      nld: 'Netherlands',
      nor: 'Norway',
      afg: 'Afghanistan',
    });
  });

  it('Should use the specified function to retrieve the iso code for the given value when dealing with nested objects', () => {
    const values = [
      {
        isoObj: { iso_code: 'nld' },
        value: 1,
      },
      {
        isoObj: { iso_code: 'nor' },
        value: 2,
      },
      {
        isoObj: { iso_code: 'afg' },
        value: 3,
      },
    ];
    const result = getLocalisedCountryNames(
      values,
      (value) => value.isoObj.iso_code
    );

    expect(result).toEqual({
      nld: 'Nederland',
      nor: 'Noorwegen',
      afg: 'Afghanistan',
    });
  });

  it('Should Error when an iso code could not be matched', () => {
    const values = [
      {
        iso_code: 'nlr',
        value: 1,
      },
    ];
    expect(() => getLocalisedCountryNames(values, 'iso_code')).toThrowError(
      /Unable to find country data for ISO code nlr/
    );
  });
});
