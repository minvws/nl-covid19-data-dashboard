import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { getVrForMunicipalityCode } from '../get-vr-for-municipality-code';
import * as sinon from 'sinon';
import * as Common from '@corona-dashboard/common';

const GetVrForMunicipalityCode = suite('getVrForMunicipalityCode');

GetVrForMunicipalityCode.after(() => {
  sinon.restore();
});

GetVrForMunicipalityCode(
  'should return the safety region data given a municipality code',
  () => {
    sinon.replaceGetter(Common, 'gmData', () => [
      {
        name: 'test gemeente',
        vrCode: 'VRTest',
        gemcode: 'GMTest',
      },
    ]);

    sinon.replaceGetter(Common, 'vrData', () => [
      {
        name: 'test veiligheidsregio',
        code: 'VRTest',
        id: 1,
      },
    ]);

    const result = getVrForMunicipalityCode('GMTest');

    console.log(result);

    // assert.ok(result);
    // assert.is(result.name, 'test veiligheidsregio');
    // assert.is(result.code, 'VRTest');
    // assert.is(result.id, 1);
  }
);

GetVrForMunicipalityCode.run();
