import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { createDateFromUnixTimestamp } from '../create-date-from-unix-timestamp';

const CreateDate = suite('createDate');

CreateDate('should create a date from a Unix timestamp in seconds', () => {
  const now = new Date().getTime();
  const timestamp = now / 1000;
  const date = createDateFromUnixTimestamp(timestamp);
  assert.instance(date, Date);
  assert.is(date.getTime(), now);
});

CreateDate.run();
