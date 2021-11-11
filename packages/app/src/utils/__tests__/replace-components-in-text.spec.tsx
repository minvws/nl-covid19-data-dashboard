import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { replaceComponentsInText } from '../replace-components-in-text';
import injectJsDom from 'jsdom-global';
import { cleanup, render } from '@testing-library/react';

const ReplaceComponentsInText = suite('replaceComponentsInText');

ReplaceComponentsInText.before((context) => {
  context.cleanupJsDom = injectJsDom();
});

ReplaceComponentsInText.after((context) => {
  context.cleanupJsDom();
});

ReplaceComponentsInText.after.each(() => {
  cleanup();
});

ReplaceComponentsInText(
  'should replace variables in double curly braces with passed components',
  () => {
    const { queryByTestId } = render(
      <>
        {replaceComponentsInText('Hello, {{name}}!', {
          name: <span data-testid="test">world</span>,
        })}
      </>
    );

    assert.ok(queryByTestId('test'));
    assert.equal(queryByTestId('test')?.textContent, 'world');
  }
);

ReplaceComponentsInText.run();
