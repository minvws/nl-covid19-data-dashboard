import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { gmData } from '@corona-dashboard/common';
import { getVrGmCodesForGmCode } from '../get-vr-gm-codes-for-gm-code';
import { vrCodeByGmCode } from '~/data/vr-code-by-gm-code';
import { gmCodesByVrCode } from '~/data/gm-codes-by-vr-code';

const GetVrGmCodesForGmCode = suite('getVrGmCodesForGmCode');

GetVrGmCodesForGmCode(
  'should return the right gm codes for a given gm code',
  () => {
    const gmCode = gmData[0].gemcode;
    const vrCode = vrCodeByGmCode[gmCode];
    const gmCodes = gmCodesByVrCode[vrCode];

    const result = getVrGmCodesForGmCode(gmCode);

    assert.ok(result);
    assert.is(result.length, gmCodes.length);
    assert.equal(result, gmCodes);
  }
);

GetVrGmCodesForGmCode('should return undefined for a fault gm code', () => {
  const result = getVrGmCodesForGmCode('blub');
  assert.not.ok(result);
  assert.is(result, undefined);
});

GetVrGmCodesForGmCode.run();
