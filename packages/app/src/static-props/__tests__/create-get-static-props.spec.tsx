import { suite } from 'uvu';
import { createGetStaticProps, SystemError } from '../create-get-static-props';
import * as sinon from 'sinon';
import * as assert from 'uvu/assert';

const CreateGetStaticProps = suite('createGetStaticProps');

CreateGetStaticProps(
  'Returns a merged object when multiple promises are passed',
  async () => {
    const fn1 = () => sinon.promise((resolve) => resolve({ a: 'b', c: 'd' }));
    const fn2 = () => sinon.promise((resolve) => resolve({ c: 'dd', e: 'ff' }));

    const propPromises = createGetStaticProps(fn1, fn2);
    const result = await propPromises();

    assert.equal(result, { props: { a: 'b', c: 'dd', e: 'ff' } });
  }
);

CreateGetStaticProps(
  'Return an object containing an error when a system error is thrown',
  async () => {
    const fn1 = () =>
      sinon.promise(() => {
        const e = new Error() as SystemError;
        e.code = 'ENOENT';
        throw e;
      });

    const propPromises = createGetStaticProps(fn1);
    const result = await propPromises();

    assert.equal(result, { notFound: true });
  }
);

CreateGetStaticProps.run();
