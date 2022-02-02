import { suite } from 'uvu';
import { filterByRegionMunicipalities } from '../filter-by-region-municipalities';
import * as File from '~/utils/get-vr-gm-codes-for-gm-code';
import * as sinon from 'sinon';
import * as assert from 'uvu/assert';

const FilterByRegionMunicipalities = suite('filterByRegionMunicipalities');

FilterByRegionMunicipalities('should filter municipalities by region', () => {
  sinon
    .stub(File, 'getVrGmCodesForGmCode')
    .returns(['AMS', 'HRLM', 'ALKM', 'VLDM']);
  const data = [{ gmcode: 'AMS' }, { gmcode: 'GR' }, { gmcode: 'VLDM' }];
  const context = { params: { code: 'NH' } };

  assert.equal(filterByRegionMunicipalities(data, context), [
    { gmcode: 'AMS' },
    { gmcode: 'VLDM' },
  ]);
});

FilterByRegionMunicipalities(
  'should throw an error if municipalCode is not in context params',
  () => {
    const data = [{ gmcode: 'AMS' }, { gmcode: 'GR' }, { gmcode: 'VLDM' }];
    const context = { params: { code: undefined } };

    assert.throws(
      () => filterByRegionMunicipalities(data, context),
      (err: Error) => err.message === 'No municipalCode in context params'
    );
  }
);

FilterByRegionMunicipalities(
  'should throw an error if no regionCodes are found for municipalCode',
  () => {
    sinon.stub(File, 'getVrGmCodesForGmCode').returns(undefined);
    const data = [{ gmcode: 'AMS' }, { gmcode: 'GR' }, { gmcode: 'VLDM' }];
    const context = { params: { code: 'NH' } };

    assert.throws(
      () => filterByRegionMunicipalities(data, context),
      (err: Error) => err.message === `No regionCodes found for NH`
    );
  }
);

FilterByRegionMunicipalities(
  'should return an empty array if data is empty',
  () => {
    sinon
      .stub(File, 'getVrGmCodesForGmCode')
      .returns(['AMS', 'HRLM', 'ALKM', 'VLDM']);
    const data: any[] = [];
    const context = { params: { code: 'NH' } };

    assert.equal(filterByRegionMunicipalities(data, context), []);
  }
);

FilterByRegionMunicipalities.after.each(() => {
  sinon.restore();
});

FilterByRegionMunicipalities.run();
