import { createDate } from '../create-date';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

const CreateDate = suite('createDate');

CreateDate('should create a date from a Unix timestamp in seconds', () => {
  const now = new Date().getTime();
  const timestamp = now / 1000;
  const date = createDate(timestamp);
  assert.instance(date, Date);
  assert.is(date.getTime(), now);
});

CreateDate.run();
