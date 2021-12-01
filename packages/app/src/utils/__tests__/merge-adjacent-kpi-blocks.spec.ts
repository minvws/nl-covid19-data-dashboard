import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { RichContentBlock } from '~/types/cms';
import { mergeAdjacentKpiBlocks } from '../merge-adjacent-kpi-blocks';

const MergeAdjacentKpiBlocks = suite('mergeAdjacentKpiBlocks');

MergeAdjacentKpiBlocks(
  'should remove two adjacent elements with _type == dashboardKpi and replace them with one element of type dashboardKpis',
  () => {
    const testSet: RichContentBlock[] = [
      { _type: 'test1' },
      { _type: 'test2' },
      { _type: 'dashboardKpi' },
      { _type: 'dashboardKpi' },
      { _type: 'test3' },
    ] as unknown as RichContentBlock[];

    const expectedSet: RichContentBlock[] = [
      { _type: 'test1' },
      { _type: 'test2' },
      {
        _type: 'dashboardKpis',
        kpis: [{ _type: 'dashboardKpi' }, { _type: 'dashboardKpi' }],
      },
      { _type: 'test3' },
    ] as unknown as RichContentBlock[];

    const resultSet = mergeAdjacentKpiBlocks(testSet);

    assert.equal(resultSet, expectedSet);
  }
);

MergeAdjacentKpiBlocks(
  'should return an identical copy of the array if no adjacent dashboardKpi elements are found',
  () => {
    const testSet: RichContentBlock[] = [
      { _type: 'test1' },
      { _type: 'test2' },
      { _type: 'dashboardKpi' },
      { _type: 'test3' },
      { _type: 'dashboardKpi' },
    ] as unknown as RichContentBlock[];

    const resultSet = mergeAdjacentKpiBlocks(testSet);

    assert.equal(resultSet, testSet);
  }
);

MergeAdjacentKpiBlocks.run();
