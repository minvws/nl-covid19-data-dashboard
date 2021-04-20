import { getSkipLinkId, ensureUniqueSkipLinkIds } from '../skip-links';

describe('Util: skipLinks', () => {
  describe('getSkipLinkId', () => {
    it('returns only lowercase characters', () => {
      expect(getSkipLinkId('MySQL, Amsterdam, YMCA')).toMatchInlineSnapshot(
        `"mysql-amsterdam-ymca"`
      );
    });

    it('replaces non-alphanumeric characters', () => {
      expect(
        getSkipLinkId('ABC this goes on until the END.')
      ).toMatchInlineSnapshot(`"abc-this-goes-on-until-the-end-"`);
    });
  });

  describe('ensureUniqueSkipLinkIds', () => {
    it('', () => {
      const source = [
        { id: 'amsterdam' },
        { id: 'amsterdam' },
        { id: 'berlin' },
        { id: 'amsterdam' },
      ];
      ensureUniqueSkipLinkIds(source);

      expect(source[0].id).toEqual('amsterdam-1');
      expect(source[1].id).toEqual('amsterdam-2');
      expect(source[2].id).toEqual('berlin');
      expect(source[3].id).toEqual('amsterdam-3');
    });
  });
});
