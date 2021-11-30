import injectJsDom from 'jsdom-global';
import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { createContext } from '../hotkey';

const CreateContext = suite('createContext');

CreateContext.before((context) => {
  context.cleanupJsDom = injectJsDom();
});

CreateContext.after((context) => {
  context.cleanupJsDom();
});

CreateContext.after.each(() => {
  sinon.restore();
});

CreateContext.before.each((context) => {
  context.addEventListenerSpy = sinon.spy(document, 'addEventListener');
  context.removeEventListenerSpy = sinon.spy(document, 'removeEventListener');
});

CreateContext('should initialize and return a register object', (context) => {
  const registration = createContext();

  assert.equal(context.addEventListenerSpy.callCount, 1);
  assert.not.equal(registration, undefined);
});

CreateContext('should clean up after destroy', (context) => {
  const registration = createContext();
  registration.destroy();

  assert.is(context.removeEventListenerSpy.callCount, 1);
});

CreateContext('should trigger the specified handler after registration', () => {
  const registration = createContext();
  const callBack = sinon.spy();

  registration.register('a', callBack);

  const kbEvent = new KeyboardEvent('keydown', {
    code: '123',
    key: 'a',
  });
  document.dispatchEvent(kbEvent);

  assert.is(callBack.callCount, 1);
});

CreateContext(
  'should not trigger the specified handler after unregistration',
  () => {
    const registration = createContext();
    const callBack = sinon.spy();

    registration.register('a', callBack);
    registration.unregister('a', callBack);

    const kbEvent = new KeyboardEvent('keydown', {
      code: '123',
      key: 'a',
    });

    document.dispatchEvent(kbEvent);

    assert.is(callBack.callCount, 0);
  }
);

CreateContext.run();
