import { suite } from 'uvu';
import { getVrForMunicipalityCode } from '../get-vr-for-municipality-code';
import * as assert from 'uvu/assert';
import { gmData, vrData } from '@corona-dashboard/common';

const GetVrForMunicipalityCode = suite('getVrForMunicipalityCode');

GetVrForMunicipalityCode(
  'should return the safety region data given a municipality code',
  () => {
    const firstMunicipality = gmData[0];
    const safetyRegion = vrData.find(
      (vr) => vr.code === firstMunicipality.vrCode
    );

    const result = getVrForMunicipalityCode(firstMunicipality.gemcode);

    assert.is(result, safetyRegion);
  }
);

GetVrForMunicipalityCode(
  'should return undefined given a faulty municipality code',
  () => {
    const result = getVrForMunicipalityCode('blub');
    assert.is(result, undefined);
  }
);

GetVrForMunicipalityCode.run();
