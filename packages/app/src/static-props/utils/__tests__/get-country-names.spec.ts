import { suite } from 'uvu';
import { getCountryNames } from '../get-country-names';
import * as File from '../load-json-from-data-file';
import * as sinon from 'sinon';
import * as assert from 'uvu/assert';

const GetCountryNames = suite('GetCountryNames');

GetCountryNames.before.each((context) => {
  context.loadStub = sinon.stub(File, 'loadJsonFromDataFile');
});

GetCountryNames(
  'Should call load function with correct parameters',
  (context) => {
    const { loadStub } = context;

    loadStub.returns({
      afg: 'Afghanistan',
      alb: 'Albanië',
      ala: 'Ålandseilanden',
      dza: 'Algerije',
    });
    const staticPropsContext = { locale: 'nl' };

    assert.equal(getCountryNames(staticPropsContext), {
      countryNames: {
        afg: 'Afghanistan',
        alb: 'Albanië',
        ala: 'Ålandseilanden',
        dza: 'Algerije',
      },
    });

    sinon.assert.calledWith(loadStub, `nl-country-names.json`, 'static-json');
  }
);

GetCountryNames('Should return country names', (context) => {
  const { loadStub } = context;

  loadStub.returns({
    afg: 'Afghanistan',
    alb: 'Albanië',
    ala: 'Ålandseilanden',
    dza: 'Algerije',
  });
  const staticPropsContext = { locale: 'nl' };

  assert.equal(getCountryNames(staticPropsContext), {
    countryNames: {
      afg: 'Afghanistan',
      alb: 'Albanië',
      ala: 'Ålandseilanden',
      dza: 'Algerije',
    },
  });

  sinon.assert.calledWith(loadStub, `nl-country-names.json`, 'static-json');
});

GetCountryNames.after.each(() => {
  sinon.restore();
});

GetCountryNames.run();
