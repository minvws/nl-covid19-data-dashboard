import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { positiveModulo } from '../positive-modulo';

const PositiveModulo = suite('positiveModule');

PositiveModulo('should return a positive number for negative input', () => {
  const n = positiveModulo(-1, 2);
  assert.ok(n > 0);
  assert.equal(Math.abs(n), n);
});

PositiveModulo('should return the positive remainder of a division', () => {
  const n = positiveModulo(-1, 2);
  assert.equal(n, 1);
});

PositiveModulo.run();
