import { suite } from 'uvu';
import { getCountryNames } from '../get-country-names';
import * as File from '../load-json-from-data-file';
import * as sinon from 'sinon';
import * as assert from 'uvu/assert';

const GetCountryNames = suite('GetCountryNames');

GetCountryNames.before.each((context) => {
  context.loadStub = sinon.stub(File, 'loadJsonFromDataFile').returns({
    afg: 'Afghanistan',
    alb: 'Albanië',
    ala: 'Ålandseilanden',
    dza: 'Algerije',
  });
});

GetCountryNames(
  'Should return country names is the correct object structure',
  () => {
    const staticPropsContext = { locale: 'nl' };

    assert.equal(getCountryNames(staticPropsContext), {
      countryNames: {
        afg: 'Afghanistan',
        alb: 'Albanië',
        ala: 'Ålandseilanden',
        dza: 'Algerije',
      },
    });
  }
);

GetCountryNames(
  ' Should call load function with correct parameters',
  (context) => {
    const { loadStub } = context;
    const staticPropsContext = { locale: 'nl' };

    getCountryNames(staticPropsContext);
    sinon.assert.calledWith(loadStub, `nl-country-names.json`, 'static-json');
  }
);

GetCountryNames.after.each(() => {
  sinon.restore();
});

GetCountryNames.run();
