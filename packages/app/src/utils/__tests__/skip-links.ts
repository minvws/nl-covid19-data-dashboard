import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { ensureUniqueSkipLinkIds, getSkipLinkId } from '../skip-links';

const GetSkipLinkId = suite('getSkipLinkId');

GetSkipLinkId('should return only lowercase characters', () => {
  assert.type(getSkipLinkId, 'function');
  assert.equal(getSkipLinkId('MySQL, Amsterdam, YMCA'), 'mysql-amsterdam-ymca');
});

GetSkipLinkId('should replace non-alphanumeric characters', () => {
  assert.equal(
    getSkipLinkId('ABC this goes on until the END.'),
    'abc-this-goes-on-until-the-end-'
  );
});

GetSkipLinkId.run();

const EnsureUniqueSkipLinkIds = suite('ensureUniqueSkipLinkIds');

EnsureUniqueSkipLinkIds('should generate unique skip link ids', () => {
  const source = [
    { id: 'amsterdam' },
    { id: 'amsterdam' },
    { id: 'berlin' },
    { id: 'amsterdam' },
  ];

  ensureUniqueSkipLinkIds(source);

  assert.equal(source[0].id, 'amsterdam-1');
  assert.equal(source[1].id, 'amsterdam-2');
  assert.equal(source[2].id, 'berlin');
  assert.equal(source[3].id, 'amsterdam-3');
});

EnsureUniqueSkipLinkIds.run();
