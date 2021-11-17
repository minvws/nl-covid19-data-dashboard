import { suite } from 'uvu';
import { findClosestSize } from '../find-closest-size';
import * as assert from 'uvu/assert';

const FindClosestSize = suite('findClosestSize');

FindClosestSize(
  'should find the closest number in sizes that is larger than the size passed',
  () => {
    const sizes = [300, 400];
    assert.is(findClosestSize(280, sizes), 300);
    assert.is(findClosestSize(320, sizes), 400);
  }
);

FindClosestSize(
  'should return the largest number in sizes when there is no match',
  () => {
    const sizes = [300, 400];
    assert.is(findClosestSize(500, sizes), 400);
  }
);

FindClosestSize.run();
